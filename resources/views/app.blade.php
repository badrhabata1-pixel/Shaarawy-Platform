<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $siteName  = (config('app.name') && config('app.name') !== 'Laravel') ? config('app.name') : 'منصة الشعراوي';
            $siteTitle = 'الأستاذ أحمد الشعراوي — منصة التاريخ';
            $siteDesc  = 'منصة تعليمية لمادة التاريخ مع الأستاذ أحمد الشعراوي — شرح واضح، فيديوهات تفاعلية، ومتابعة مستمرة لحد ما تلم المنهج.';
            $siteImage = url('/favicon-512.png');
        @endphp
        <title inertia>{{ $siteTitle }}</title>
        <meta name="description" content="{{ $siteDesc }}">

        <!-- معاينة الرابط (واتساب / تليجرام / فيسبوك) -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:title" content="{{ $siteTitle }}">
        <meta property="og:description" content="{{ $siteDesc }}">
        <meta property="og:image" content="{{ $siteImage }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:locale" content="ar_AR">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="{{ $siteTitle }}">
        <meta name="twitter:description" content="{{ $siteDesc }}">
        <meta name="twitter:image" content="{{ $siteImage }}">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
