<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function hydrated(array $items): array
    {
        $ids = array_column($items, 'product_id');
        $products = $ids
            ? Product::whereIn('_id', $ids)->get()->keyBy(fn ($p) => (string) $p->_id)
            : collect();

        $rows = [];
        foreach ($items as $item) {
            $product = $products->get((string) $item['product_id']);
            if (!$product) continue;
            $quantity = max(1, (int) ($item['quantity'] ?? 1));
            $rows[] = [
                'product_id' => (string) $product->_id,
                'name' => $product->name,
                'category' => $product->category,
                'unit_price' => (float) $product->price,
                'quantity' => $quantity,
                'line_total' => round((float) $product->price * $quantity, 2),
            ];
        }
        return $rows;
    }

    private function respond(Cart $cart): array
    {
        $items = $this->hydrated($cart->items ?? []);
        return [
            'items' => $items,
            'subtotal' => round(array_sum(array_column($items, 'line_total')), 2),
        ];
    }

    public function index(Request $request)
    {
        $cart = Cart::where('user_id', (string) $request->user()->_id)->first();
        if (!$cart) return response()->json(['items' => [], 'subtotal' => 0]);
        return response()->json($this->respond($cart));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'string'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:99'],
        ]);
        $product = Product::where('_id', $data['product_id'])->where('active', true)->firstOrFail();
        $quantity = max(1, (int) ($data['quantity'] ?? 1));

        $userId = (string) $request->user()->_id;
        $cart = Cart::firstOrNew(['user_id' => $userId]);
        if (!$cart->exists) $cart->items = [];

        $items = $cart->items ?? [];
        $found = false;
        foreach ($items as $i => $item) {
            if ((string) $item['product_id'] === (string) $product->_id) {
                $items[$i]['quantity'] = min(99, (int) $item['quantity'] + $quantity);
                $found = true;
                break;
            }
        }
        if (!$found) $items[] = ['product_id' => (string) $product->_id, 'quantity' => $quantity];

        $cart->items = $items;
        $cart->save();
        return response()->json($this->respond($cart), 201);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'max:50'],
            'items.*.product_id' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $userId = (string) $request->user()->_id;
        $cart = Cart::firstOrNew(['user_id' => $userId]);
        $cart->items = array_map(
            fn ($row) => ['product_id' => (string) $row['product_id'], 'quantity' => (int) $row['quantity']],
            $data['items']
        );
        $cart->save();
        return response()->json($this->respond($cart));
    }

    public function destroy(Request $request)
    {
        Cart::where('user_id', (string) $request->user()->_id)->delete();
        return response()->json(['message' => 'Cart cleared.']);
    }
}
