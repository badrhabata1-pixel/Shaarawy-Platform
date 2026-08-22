<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use App\Models\PaymentSetting;
use App\Models\PromoCode;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        $student = Auth::guard('student')->user();

        // الطالب الأوفلاين معاه كود تفعيل بدل الدفع الإلكتروني — يشوف شاشة إدخال الكود مش صفحة الدفع
        if ($student && $student->student_type === 'offline') {
            return Inertia::render('Student/Payment/Activate');
        }

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

    public function activate(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'min:4', 'max:20'],
        ]);

        $student = Auth::guard('student')->user();
        $ok = PromoCode::redeem($data['code'], $student);

        if (!$ok) {
            return back()->withErrors(['code' => 'الكود غير صحيح أو مستخدم من قبل']);
        }

        return redirect()->route('student.lessons')
            ->with('success', 'تم تفعيل الاشتراك بنجاح ✓');
    }

    public function store(Request $request)
    {
        $student = Auth::guard('student')->user();
        if ($student && $student->student_type === 'offline') {
            abort(403, 'الطلاب الأوفلاين يفعّلون الاشتراك بكود التفعيل.');
        }

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
