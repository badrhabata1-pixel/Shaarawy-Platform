<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\Subscription;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $requests = PaymentRequest::with(['student:id,name,phone', 'unit:id,title'])
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Assistant/Payments/Index', [
            'requests' => $requests,
        ]);
    }

    public function approve(Request $request, PaymentRequest $paymentRequest)
    {
        if (! $paymentRequest->isPending()) {
            if ($paymentRequest->status === 'approved') {
                $this->activateSubscription($paymentRequest);

                return back()->with('success', 'تم تفعيل الاشتراك لهذا الطلب بالفعل ✓');
            }

            return back()->withErrors(['error' => 'هذا الطلب تمت مراجعته مسبقا']);
        }

        $request->validate(['note' => ['nullable', 'string', 'max:500']]);

        $paymentRequest->update([
            'status'      => 'approved',
            'admin_note'  => $request->input('note'),
            'reviewed_at' => now(),
        ]);

        $this->activateSubscription($paymentRequest);

        return back()->with('success', 'تمت الموافقة وتفعيل الاشتراك ✓');
    }

    public function reject(Request $request, PaymentRequest $paymentRequest)
    {
        if (! $paymentRequest->isPending()) {
            return back()->withErrors(['error' => 'هذا الطلب تمت مراجعته مسبقا']);
        }

        $request->validate(['note' => ['nullable', 'string', 'max:500']]);

        $paymentRequest->update([
            'status'      => 'rejected',
            'admin_note'  => $request->input('note'),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'تم رفض الطلب ✓');
    }

    private function activateSubscription(PaymentRequest $paymentRequest): Subscription
    {
        $unit = Unit::findOrFail($paymentRequest->unit_id);

        return Subscription::firstOrCreate(
            [
                'student_id' => $paymentRequest->student_id,
                'unit_id'    => $paymentRequest->unit_id,
            ],
            [
                'class_id'       => $unit->academic_year_id,
                'type'           => 'unit',
                'price'          => $paymentRequest->amount ?? 0,
                'status'         => 'active',
                'is_active'      => true,
                'payment_method' => $paymentRequest->method,
                'start_date'     => now()->toDateString(),
            ]
        );
    }
}
