<?php

namespace App\Services;

use InvalidArgumentException;

class PaymentServiceFactory
{
    public function for(string $provider): PaymentGateway
    {
        return match ($provider) {
            'telebirr' => app(TelebirrService::class),
            'cbe' => app(CbeService::class),
            default => throw new InvalidArgumentException('Unsupported payment provider.'),
        };
    }
}
