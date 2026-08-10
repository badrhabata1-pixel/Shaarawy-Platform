<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\PaymentSetting;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        $units = Unit::where('is_visible', true)
            ->where('is_free', false)
            ->with('academicYear:id,name')
            ->orderByDesc('id')
            ->get(['id', 'title', 'price', 'academic_year_id']);

        return Inertia::render('Student/Payment/Create', [
            'units'    => $units,
            'settings' => PaymentSetting::allAsArray(),
            'preUnit'  => $request->query('unit_id'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'unit_id'      => ['required', 'exists:units,id'],
            'method'       => ['required', 'in:vodafone,instapay'],
            'account_name' => ['required', 'string', 'max:120'],
            'amount'       => ['nullable', 'numeric', 'min:0'],
            'screenshot'   => ['required', 'image', 'max:5120'],
        ]);

        // Prevent duplicate pending requests for same unit
        $studentId = Auth::guard('student')->id();

        $exists = PaymentRequest::where('student_id', $studentId)
            ->where('unit_id', $data['unit_id'])
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return back()->withErrors(['unit_id' => 'لديك طلب دفع معلق لهذه الوحدة بالفعل.']);
        }

        $data['student_id'] = $studentId;

        $file = $request->file('screenshot');
        $filename = 'pay_' . $studentId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $dir = public_path('uploads/payment_screenshots');
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        $file->move($dir, $filename);
        $data['screenshot'] = 'uploads/payment_screenshots/' . $filename;

        PaymentRequest::create($data);

        return redirect()->route('student.payment.history')
            ->with('success', 'تم إرسال طلب الدفع بنجاح ✓ سيتم مراجعته قريباً');
    }

    public function history()
    {
        $requests = PaymentRequest::where('student_id', Auth::guard('student')->id())
            ->with('unit:id,title')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Student/Payment/History', [
            'requests' => $requests,
        ]);
    }
}
