<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $primaryKey = '_id';

    protected $fillable = [
        'user_id', 'order_id', 'provider', 'provider_reference',
        'amount', 'currency', 'status', 'provider_payload_hash', 'verified_at',
    ];

    protected $casts = ['amount' => 'float', 'verified_at' => 'datetime'];
}
