<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        User::query()->delete();
        Product::query()->delete();
    }

    private function admin(): User
    {
        return User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('secret-password'), 'role' => 'admin']);
    }

    private function customer(): User
    {
        return User::create(['name' => 'Customer', 'email' => 'user@example.com', 'password' => bcrypt('secret-password'), 'role' => 'customer']);
    }

    private function productPayload(): array
    {
        return ['name' => 'Lamp', 'category' => 'Home', 'price' => 500, 'stock' => 5];
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->postJson('/api/admin/products', $this->productPayload())->assertStatus(401);
    }

    public function test_customer_cannot_access_admin_routes(): void
    {
        Sanctum::actingAs($this->customer());

        $this->postJson('/api/admin/products', $this->productPayload())->assertStatus(403);
        $this->getJson('/api/admin/orders')->assertStatus(403);
    }

    public function test_admin_can_create_and_delete_products(): void
    {
        Sanctum::actingAs($this->admin());

        $response = $this->postJson('/api/admin/products', $this->productPayload());
        $response->assertStatus(201);
        $id = $response->json('product._id');
        $this->assertTrue(Product::where('_id', $id)->exists());

        $this->deleteJson("/api/admin/products/{$id}")->assertStatus(200);
        $this->assertFalse(Product::where('_id', $id)->exists());
    }

    public function test_admin_order_update_only_changes_fulfillment_status(): void
    {
        Sanctum::actingAs($this->admin());

        $product = Product::create(['name' => 'Bag', 'category' => 'Fashion', 'price' => 100, 'stock' => 10, 'active' => true, 'slug' => 'bag-abc123']);
        Sanctum::actingAs($this->customer());
        $order = $this->postJson('/api/orders', [
            'items' => [['product_id' => (string) $product->_id, 'quantity' => 1]],
            'shipping_address' => 'Addis Ababa',
            'payment_method' => 'telebirr',
        ])->assertStatus(201)->json('order');

        Sanctum::actingAs($this->admin());
        $this->putJson("/api/admin/orders/{$order['_id']}", ['status' => 'shipped'])
            ->assertStatus(200)
            ->assertJsonPath('order.status', 'shipped')
            ->assertJsonPath('order.payment_status', 'pending');

        // Admins must not be able to mark an order paid directly.
        $this->putJson("/api/admin/orders/{$order['_id']}", ['payment_status' => 'paid'])
            ->assertStatus(422);
    }
}
