<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $primaryKey = '_id';

    protected $fillable = [
        'user_id', 'order_number', 'items', 'subtotal',
        'shipping_address', 'payment_method', 'payment_status', 'status',
    ];

    protected $casts = ['items' => 'array', 'subtotal' => 'float'];
}
