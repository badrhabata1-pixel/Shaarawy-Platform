<?php

namespace App\Http\Middleware;

use App\Models\PaymentRequest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'adminNotifications' => function () {
                if (! auth()->guard('web')->check()) return null;

                $pendingPayments  = Schema::hasTable('payment_requests')
                    ? PaymentRequest::where('status', 'pending')->count()
                    : 0;

                $pendingStudents  = Schema::hasTable('students')
                    ? Student::where('status', 'pending')->count()
                    : 0;

                return [
                    'payments' => $pendingPayments,
                    'students' => $pendingStudents,
                    'total'    => $pendingPayments + $pendingStudents,
                ];
            },
        ];
    }
}
