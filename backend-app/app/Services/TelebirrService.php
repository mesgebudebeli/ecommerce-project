<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class TelebirrService implements PaymentGateway
{
    public function createCheckout(Order $order, Payment $payment): array
    {
        // TODO: Implement using the current official Telebirr merchant API:
        // 1) request credentials/token, 2) build required payload,
        // 3) sign exactly as documented, 4) send server-to-server,
        // 5) validate provider response and persist its reference.
        // Never invent a checkout URL or report payment as successful.
        if (!config('services.telebirr.merchant_id') || !config('services.telebirr.app_key')) {
            return ['provider' => 'telebirr', 'status' => 'pending', 'message' => 'Telebirr merchant credentials/API adapter are not configured.'];
        }
        throw new \RuntimeException('Telebirr adapter requires implementation from your current official merchant documentation.');
    }

    public function verifyWebhook(Request $request): ?array
    {
        // TODO: Verify provider signature, merchant identity, timestamp/replay window,
        // amount/currency/reference and query the provider for final transaction status.
        // Return null until full verification is implemented.
        return null;
    }
}
