<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';
    protected $fillable = ['name', 'slug', 'description', 'category', 'price', 'stock', 'images', 'active'];
    protected $casts = ['price' => 'float', 'stock' => 'integer', 'active' => 'boolean'];
}
