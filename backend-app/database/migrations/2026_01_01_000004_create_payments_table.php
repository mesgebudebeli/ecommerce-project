<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id('_id');
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('order_id')->index();
            $table->string('provider');
            $table->string('provider_reference')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('currency', 8)->default('ETB');
            $table->string('status')->default('pending')->index();
            $table->string('provider_payload_hash')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
