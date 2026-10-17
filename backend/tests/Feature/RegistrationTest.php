<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        User::query()->delete();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => 'supersecret123',
            'password_confirmation' => 'supersecret123',
        ], $overrides);
    }

    public function test_public_registration_always_creates_a_customer(): void
    {
        $response = $this->postJson('/api/register', $this->payload(['role' => 'admin']));

        $response->assertStatus(201);
        $user = User::where('email', 'customer@example.com')->first();
        $this->assertNotNull($user);
        $this->assertSame('customer', $user->role);
    }

    public function test_duplicate_email_is_rejected(): void
    {
        $this->postJson('/api/register', $this->payload())->assertStatus(201);
        $this->postJson('/api/register', $this->payload())->assertStatus(422);
    }

    public function test_short_password_is_rejected(): void
    {
        $this->postJson('/api/register', $this->payload([
            'password' => 'short',
            'password_confirmation' => 'short',
        ]))->assertStatus(422);
    }
}
