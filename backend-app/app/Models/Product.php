<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Template/API contract uses `_id` (MongoDB style); we keep that column name
    // on SQLite so controllers, tests and the React client stay unchanged.
    protected $primaryKey = '_id';

    protected $fillable = ['name', 'slug', 'description', 'category', 'price', 'stock', 'images', 'active'];

    protected $casts = [
        // Serialize `_id` as a string so the API matches the MongoDB template
        // contract (clients send string ids back; validation expects strings).
        '_id' => 'string',
        'price' => 'float',
        'stock' => 'integer',
        'images' => 'array',
        'active' => 'boolean',
    ];
}
