<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    // Template/API contract uses `_id` (MongoDB style); kept as the real
    // primary-key column on SQLite so controllers/tests/clients stay unchanged.
    protected $primaryKey = '_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * Note: no `hashed` cast here. AuthController (and the seeder) hash the
     * password explicitly with Hash::make, so adding it would double-hash.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Serialize `_id` as a string to match the MongoDB template contract.
            '_id' => 'string',
            'email_verified_at' => 'datetime',
        ];
    }
}
