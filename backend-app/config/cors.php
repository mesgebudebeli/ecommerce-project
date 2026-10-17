<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    |
    | The React app is served from a different origin than this API
    | (Apache: http://localhost/... and Vite dev: http://localhost:5173),
    | so the browser needs CORS headers. Bearer-token auth is used, not
    | cookies, so credentials support stays off and origins can be "*" in dev.
    | Tighten `allowed_origins` to your real domain(s) before production.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'up'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
