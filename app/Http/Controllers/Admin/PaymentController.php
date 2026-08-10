<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\PaymentSetting;
use App\Models\Subscription;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = PaymentRequest::with(['student:id,name,phone', 'unit:id,title'])
            ->orderByDesc('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Payments/Index', [
            'requests'     => $query->get(),
            'statusFilter' => $request->status ?? 'all',
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
            'reviewed_by' => Auth::id(),
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
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'تم رفض الطلب ✓');
    }

    public function settings()
    {
        return Inertia::render('Admin/Payments/Settings', [
            'settings' => PaymentSetting::allAsArray(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'vodafone_number' => ['required', 'string', 'max:20'],
            'vodafone_name'   => ['required', 'string', 'max:80'],
            'instapay_number' => ['required', 'string', 'max:20'],
            'instapay_name'   => ['required', 'string', 'max:80'],
        ]);

        foreach ($data as $key => $value) {
            PaymentSetting::set($key, $value);
        }

        return back()->with('success', 'تم حفظ أرقام الدفع بنجاح ✓');
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
