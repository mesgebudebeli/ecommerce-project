<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Payment;
use App\Services\PaymentServiceFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request, PaymentServiceFactory $payments)
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'shipping_address' => ['required', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:telebirr,cbe'],
        ]);

        $items = [];
        $total = 0;
        foreach ($data['items'] as $row) {
            $product = Product::where('_id', $row['product_id'])->where('active', true)->firstOrFail();
            if ((int) $product->stock < (int) $row['quantity']) {
                return response()->json(['message' => "Insufficient stock for {$product->name}."], 422);
            }
            $line = round((float) $product->price * (int) $row['quantity'], 2);
            $items[] = ['product_id' => (string) $product->_id, 'name' => $product->name, 'unit_price' => (float) $product->price, 'quantity' => (int) $row['quantity'], 'line_total' => $line];
            $total += $line;
        }

        // For production, use MongoDB transactions/atomic stock reservation to prevent overselling.
        $order = Order::create([
            'user_id' => (string) $request->user()->_id,
            'order_number' => 'ESH-' . strtoupper(Str::random(10)),
            'items' => $items, 'subtotal' => round($total, 2),
            'shipping_address' => $data['shipping_address'],
            'payment_method' => $data['payment_method'],
            'payment_status' => 'pending', 'status' => 'pending',
        ]);

        $payment = Payment::create([
            'user_id' => (string) $request->user()->_id,
            'order_id' => (string) $order->_id, 'provider' => $data['payment_method'],
            'amount' => round($total, 2), 'currency' => 'ETB', 'status' => 'pending',
        ]);

        $checkout = $payments->for($data['payment_method'])->createCheckout($order, $payment);
        if (!empty($checkout['provider_reference'])) {
            $payment->provider_reference = $checkout['provider_reference'];
            $payment->save();
        }

        return response()->json([
            'message' => 'Order created; payment is pending provider verification.',
            'order' => $order, 'payment' => $payment,
            'checkout_url' => $checkout['checkout_url'] ?? null,
        ], 201);
    }

    public function mine(Request $request)
    {
        return response()->json(['data' => Order::where('user_id', (string) $request->user()->_id)->orderBy('created_at', 'desc')->get()]);
    }

    public function adminIndex()
    {
        return response()->json(['data' => Order::orderBy('created_at', 'desc')->get()]);
    }

    // Fulfillment status only. payment_status must never be set from an admin
    // request; it changes only through verified provider webhooks.
    public function adminUpdate(Request $request, string $id)
    {
        $data = $request->validate(['status' => ['required', 'in:pending,processing,shipped,delivered,cancelled']]);
        $order = Order::where('_id', $id)->firstOrFail();
        $order->status = $data['status'];
        $order->save();
        return response()->json(['order' => $order]);
    }
}
