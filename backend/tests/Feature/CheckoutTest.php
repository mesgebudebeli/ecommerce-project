<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        User::query()->delete();
        Product::query()->delete();
        Order::query()->delete();
        Payment::query()->delete();
    }

    private function customer(): User
    {
        return User::create(['name' => 'Buyer', 'email' => 'buyer@example.com', 'password' => bcrypt('secret-password'), 'role' => 'customer']);
    }

    private function product(float $price, int $stock): Product
    {
        return Product::create([
            'name' => 'Headphones', 'category' => 'Electronics',
            'price' => $price, 'stock' => $stock, 'active' => true,
            'slug' => 'headphones-' . uniqid(),
        ]);
    }

    public function test_checkout_recalculates_totals_from_database_prices(): void
    {
        Sanctum::actingAs($this->customer());
        $product = $this->product(100.0, 10);

        $response = $this->postJson('/api/orders', [
            'items' => [['product_id' => (string) $product->_id, 'quantity' => 3]],
            'shipping_address' => 'Bole, Addis Ababa',
            'payment_method' => 'telebirr',
        ]);

        $response->assertStatus(201);
        $this->assertSame(300.0, (float) $response->json('order.subtotal'));
        $this->assertSame('pending', $response->json('order.payment_status'));
        $this->assertSame('pending', $response->json('payment.status'));
    }

    public function test_insufficient_stock_is_rejected(): void
    {
        Sanctum::actingAs($this->customer());
        $product = $this->product(100.0, 1);

        $this->postJson('/api/orders', [
            'items' => [['product_id' => (string) $product->_id, 'quantity' => 5]],
            'shipping_address' => 'Addis Ababa',
            'payment_method' => 'cbe',
        ])->assertStatus(422);
    }

    public function test_guest_cannot_create_order_or_use_cart(): void
    {
        $product = $this->product(100.0, 10);

        $this->postJson('/api/orders', [
            'items' => [['product_id' => (string) $product->_id, 'quantity' => 1]],
            'shipping_address' => 'Addis Ababa',
            'payment_method' => 'telebirr',
        ])->assertStatus(401);

        $this->postJson('/api/cart', ['product_id' => (string) $product->_id])->assertStatus(401);
    }

    public function test_cart_add_merges_quantities_for_the_same_product(): void
    {
        Sanctum::actingAs($this->customer());
        $product = $this->product(100.0, 20);

        $this->postJson('/api/cart', ['product_id' => (string) $product->_id, 'quantity' => 2])->assertStatus(201);
        $response = $this->postJson('/api/cart', ['product_id' => (string) $product->_id, 'quantity' => 3]);

        $response->assertStatus(201);
        $this->assertCount(1, $response->json('items'));
        $this->assertSame(5, $response->json('items.0.quantity'));
        $this->assertSame(500.0, (float) $response->json('subtotal'));
    }
}
