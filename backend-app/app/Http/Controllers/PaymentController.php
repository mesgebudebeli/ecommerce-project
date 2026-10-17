<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentServiceFactory;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function initiate(Request $request, PaymentServiceFactory $payments)
    {
        $data = $request->validate(['order_id' => ['required', 'string'], 'provider' => ['required', 'in:telebirr,cbe']]);
        $order = Order::where('_id', $data['order_id'])->where('user_id', (string) $request->user()->_id)->firstOrFail();
        $payment = Payment::where('order_id', (string) $order->_id)->where('provider', $data['provider'])->firstOrFail();
        if ($payment->status === 'paid') return response()->json(['message' => 'Already paid.'], 409);
        $result = $payments->for($data['provider'])->createCheckout($order, $payment);
        if (!empty($result['provider_reference'])) {
            $payment->provider_reference = $result['provider_reference'];
            $payment->save();
        }
        return response()->json($result);
    }

    public function webhook(string $provider, Request $request, PaymentServiceFactory $payments)
    {
        // Do not trust client-originated payment claims. Adapter must verify official provider
        // signature/token and query transaction status before returning a verified result.
        $result = $payments->for($provider)->verifyWebhook($request);
        if (!$result || empty($result['verified']) || empty($result['provider_reference'])) {
            return response()->json(['message' => 'Invalid or unverified payment notification.'], 401);
        }

        $payment = Payment::where('provider', $provider)->where('provider_reference', $result['provider_reference'])->first();
        if (!$payment) return response()->json(['message' => 'Payment reference not found.'], 404);
        if ($payment->status === 'paid') return response()->json(['message' => 'Already processed.']); // idempotency

        if (($result['status'] ?? '') !== 'SUCCESS' ||
            round((float) ($result['amount'] ?? -1), 2) !== round((float) $payment->amount, 2) ||
            ($result['currency'] ?? 'ETB') !== 'ETB') {
            $payment->status = 'failed';
            $payment->save();
            return response()->json(['message' => 'Payment amount, currency, or status mismatch.'], 422);
        }

        $payment->status = 'paid';
        $payment->verified_at = now();
        $payment->save();
        $order = Order::where('_id', $payment->order_id)->first();
        if ($order) { $order->payment_status = 'paid'; $order->status = 'processing'; $order->save(); }
        return response()->json(['message' => 'Payment verified.']);
    }
}
