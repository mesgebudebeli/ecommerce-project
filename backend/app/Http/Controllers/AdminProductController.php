<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'active' => ['sometimes', 'boolean'],
            'images' => ['sometimes', 'array', 'max:8'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(6));
        $data['active'] = $data['active'] ?? true;
        $product = Product::create($data);
        return response()->json(['product' => $product], 201);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::where('_id', $id)->firstOrFail();
        $data = $request->validate(array_map(fn($rule) => array_merge(['sometimes'], $rule), $this->rules()));
        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(6));
        }
        $product->fill($data)->save();
        return response()->json(['product' => $product]);
    }

    public function destroy(string $id)
    {
        $product = Product::where('_id', $id)->firstOrFail();
        $product->delete();
        return response()->json(['message' => 'Product deleted.']);
    }
}
