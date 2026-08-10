<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\PaymentReceipt;
use Illuminate\Http\Request;

class PaymentReceiptController extends Controller
{
    /**
     * استقبال وحفظ صورة الإيصال المرفوعة من الطالب
     */
    public function store(Request $request)
    {
        $request->validate([
            'receipt_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096',
            'payment_method' => 'required|in:vodafone_cash,instapay',
        ]);

        /** @var \App\Models\Student $student */
        $student = auth()->guard('student')->user();

        if ($request->hasFile('receipt_image')) {
            $file = $request->file('receipt_image');
            $filename = 'receipt_' . $student->id . '_' . time() . '.' . $file->getClientOriginalExtension();

            if (!file_exists(public_path('uploads/receipts'))) {
                mkdir(public_path('uploads/receipts'), 0777, true);
            }

            $file->move(public_path('uploads/receipts'), $filename);

            PaymentReceipt::create([
                'student_id'      => $student->id,
                'image'           => $filename,
                'payment_method'  => $request->payment_method,
                'status'          => 'pending',
            ]);
        }

        return redirect()->back()->with('success', 'تم إرسال إيصال التحويل بنجاح! جاري مراجعته وتفعيل المحاضرات فوراً 🧾');
    }
}
