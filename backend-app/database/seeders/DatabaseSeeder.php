<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // First admin is created server-side only (there is no public admin signup).
        // Change this password after your first login.
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Store Admin', 'password' => Hash::make('admin-password-123'), 'role' => 'admin']
        );

        // Demo customer, handy for testing login quickly.
        User::updateOrCreate(
            ['email' => 'customer@example.com'],
            ['name' => 'Demo Customer', 'password' => Hash::make('customer-password-123'), 'role' => 'customer']
        );

        $catalog = [
            ['name' => 'Wireless Headphones', 'category' => 'Electronics', 'description' => 'Comfortable everyday audio with long battery life.', 'price' => 2499, 'stock' => 12],
            ['name' => 'Everyday Backpack', 'category' => 'Fashion', 'description' => 'A durable bag for work and travel.', 'price' => 1599, 'stock' => 20],
            ['name' => 'Smart Watch', 'category' => 'Electronics', 'description' => 'Track activity and stay connected.', 'price' => 3299, 'stock' => 8],
            ['name' => 'Desk Lamp', 'category' => 'Home & Living', 'description' => 'A clean, modern desk light.', 'price' => 899, 'stock' => 30],
        ];

        foreach ($catalog as $row) {
            Product::updateOrCreate(
                ['slug' => Str::slug($row['name']) . '-demo'],
                $row + ['active' => true, 'images' => []]
            );
        }
    }
}
