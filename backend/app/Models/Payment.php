<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Payment extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'payments';
    protected $fillable = ['user_id', 'order_id', 'provider', 'provider_reference', 'amount', 'currency', 'status', 'provider_payload_hash', 'verified_at'];
    protected $casts = ['amount' => 'float', 'verified_at' => 'datetime'];
}
