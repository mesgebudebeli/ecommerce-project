<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

interface PaymentGateway
{
    public function createCheckout(Order $order, Payment $payment): array;
    /** Return verified transaction data only after validating the provider's signature and status. */
    public function verifyWebhook(Request $request): ?array;
}
