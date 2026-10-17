<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('_id');
            $table->unsignedBigInteger('user_id')->index();
            $table->string('order_number')->unique();
            $table->json('items');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->text('shipping_address');
            $table->string('payment_method');
            $table->string('payment_status')->default('pending')->index();
            $table->string('status')->default('pending')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
