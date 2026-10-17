<?php

namespace App\Http\Controllers;

use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Product::where('active', true)->orderBy('created_at', 'desc')->get()]);
    }

    public function show(string $id)
    {
        $product = Product::where('_id', $id)->where('active', true)->firstOrFail();
        return response()->json($product);
    }
}
