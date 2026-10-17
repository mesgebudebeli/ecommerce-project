<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class CbeService implements PaymentGateway
{
    public function createCheckout(Order $order, Payment $payment): array
    {
        // TODO: Implement the CBE/authorized payment partner's current merchant API.
        // CBE may offer different payment products; use the product enabled for your merchant.
        if (!config('services.cbe.merchant_id') || !config('services.cbe.api_key')) {
            return ['provider' => 'cbe', 'status' => 'pending', 'message' => 'CBE merchant credentials/API adapter are not configured.'];
        }
        throw new \RuntimeException('CBE adapter requires implementation from your current official merchant documentation.');
    }

    public function verifyWebhook(Request $request): ?array
    {
        // TODO: Verify callback authenticity and query the provider before marking paid.
        return null;
    }
}
