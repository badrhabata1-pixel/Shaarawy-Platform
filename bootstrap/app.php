<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\ShareStudentData::class,
        ]);

        // ─── Custom middleware aliases ─────────────────────────────────────
        $middleware->alias([
            'student.active' => \App\Http\Middleware\EnsureStudentIsActive::class,
            'no.cache'       => \App\Http\Middleware\SetNoCacheHeaders::class,
        ]);

        // Redirect unauthenticated users to the correct login page per guard
        $middleware->redirectGuestsTo(fn ($request) =>
            $request->is('student/*')   ? route('student.login')   :
            ($request->is('assistant/*') ? route('assistant.login') : route('login'))
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();