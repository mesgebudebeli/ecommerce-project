<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';
    protected $fillable = ['user_id', 'order_number', 'items', 'subtotal', 'shipping_address', 'payment_method', 'payment_status', 'status'];
    protected $casts = ['items' => 'array', 'subtotal' => 'float'];
}
