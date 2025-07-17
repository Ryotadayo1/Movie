<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // ...
        ],

        'api' => [
            EnsureFrontendRequestsAreStateful::class, // ✅ ここを忘れずに！
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $middleware = [
        // グローバルミドルウェア（省略可）
    ];

    protected $routeMiddleware = [
        // ルートミドルウェア（省略可）
    ];
}
