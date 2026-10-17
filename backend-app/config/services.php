<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'telebirr' => [
        'base_url' => env('TELEBIRR_BASE_URL'),
        'merchant_id' => env('TELEBIRR_MERCHANT_ID'),
        'app_id' => env('TELEBIRR_APP_ID'),
        'app_key' => env('TELEBIRR_APP_KEY'),
        'private_key' => env('TELEBIRR_PRIVATE_KEY'),
        'callback_url' => env('TELEBIRR_CALLBACK_URL'),
    ],

    'cbe' => [
        'base_url' => env('CBE_BASE_URL'),
        'merchant_id' => env('CBE_MERCHANT_ID'),
        'api_key' => env('CBE_API_KEY'),
        'callback_url' => env('CBE_CALLBACK_URL'),
    ],

];
