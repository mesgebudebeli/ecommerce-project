<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $primaryKey = '_id';

    protected $fillable = ['user_id', 'items'];

    protected $casts = ['_id' => 'string', 'items' => 'array'];
}
