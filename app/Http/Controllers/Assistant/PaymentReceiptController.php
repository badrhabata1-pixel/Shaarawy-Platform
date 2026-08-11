<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\PaymentRequest;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class PaymentReceiptController extends Controller
{
    public function index()
    {
        $receipts = collect();

        if (Schema::hasTable('payment_requests')) {
            $receipts = PaymentRequest::with(['student:id,name,phone,email,image', 'unit:id,title'])
                ->where('status', 'approved')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($request) => [
                    'id'             => $request->id,
                    'image_url'      => $request->screenshot
                        ? (str_starts_with($request->screenshot, 'uploads/')
                            ? asset($request->screenshot)
                            : asset('storage/' . $request->screenshot))
                        : null,
                    'status'         => $request->status,
                    'payment_method' => $request->method,
                    'unit_title'     => $request->unit?->title,
                    'amount'         => $request->amount,
                    'admin_note'     => $request->admin_note,
                    'student_name'   => $request->student?->name ?? 'طالب غير معروف',
                    'student_phone'  => $request->student?->phone ?? '-',
                    'student_email'  => $request->student?->email ?? '-',
                    'created_at'     => $request->created_at?->format('Y-m-d H:i'),
                    'submitted_at'   => $request->created_at?->format('Y-m-d H:i'),
                    'student'        => [
                        'id'    => $request->student?->id,
                        'name'  => $request->student?->name,
                        'phone' => $request->student?->phone,
                    ],
                ]);
        }

        $isAssistant = request()->routeIs('assistant.*');
        $user = $isAssistant ? auth()->guard('assistant')->user() : auth()->user();

        return Inertia::render($isAssistant ? 'Assistant/Receipts/Index' : 'Admin/Receipts/Index', [
            'receipts'  => $receipts,
            'assistant' => $isAssistant ? $user : null,
        ]);
    }

    public function approve($id)
    {
        return redirect()
            ->back()
            ->with('success', 'إيصالات الدفع تعرض الطلبات المقبولة فقط. راجع الطلبات من صفحة طلبات الدفع.');
    }

    public function reject($id)
    {
        return redirect()
            ->back()
            ->with('success', 'إيصالات الدفع تعرض الطلبات المقبولة فقط. راجع الطلبات من صفحة طلبات الدفع.');
    }
}
