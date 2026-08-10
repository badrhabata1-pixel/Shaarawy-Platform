<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * جلب جميع الطلاب المسجلين بالمنصة مع دعم البحث السريع (الاسم أو الإيميل أو الهاتف)
     */
    public function index(Request $request)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();
        
        $search = $request->input('search');

        // جلب جميع الطلاب من قاعدة البيانات
        $query = Student::with(['academicYear:id,name', 'group:id,name'])
            ->orderByDesc('id');

        // تطبيق البحث النصي المطور
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        $students = $query->get()->map(fn($s) => [
            'id'            => $s->id,
            'name'          => $s->name,
            'email'         => $s->email,
            'phone'         => $s->phone,
            'parent_phone'  => $s->parent_phone,
            'student_type'  => $s->student_type,
            'center_code'   => $s->center_code,
            'governorate'   => $s->governorate,
            'status'        => $s->status,
            'is_active'     => $s->is_active,
            'academic_year' => $s->academicYear?->name ?? 'غير حدد',
            'group_name'    => $s->group?->name ?? 'بدون مجموعة',
            'created_at'    => $s->created_at?->format('Y-m-d'),
        ]);

        return Inertia::render('Assistant/Students/Index', [
            'assistant' => $assistant,
            'students'  => $students,
            'filters'   => [
                'search' => $search
            ]
        ]);
    }

    /**
     * عرض الطلاب المعلقين بانتظار التفعيل
     */
    public function requests()
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        $students = Student::where('status', 'pending')
            ->where('is_active', false)
            ->with(['academicYear:id,name', 'group:id,name'])
            ->orderByDesc('id')
            ->get()
            ->map(fn($s) => [
                'id'            => $s->id,
                'name'          => $s->name,
                'email'         => $s->email,
                'phone'         => $s->phone,
                'parent_phone'  => $s->parent_phone,
                'student_type'  => $s->student_type,
                'center_code'   => $s->center_code,
                'governorate'   => $s->governorate,
                'image'         => $s->image,
                'academic_year' => $s->academicYear?->name,
                'group_name'    => $s->group?->name,
                'created_at'    => $s->created_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Assistant/StudentRequests', [
            'students'  => $students,
            'assistant' => $assistant,
        ]);
    }

    /**
     * تفعيل وقبول حساب الطالب
     */
    public function approve(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'center_code' => ['nullable', 'string', 'max:50'],
        ]);

        $updateData = [
            'status'    => 'active',
            'is_active' => true,
        ];

        if (!empty($validated['center_code'])) {
            $updateData['center_code'] = $validated['center_code'];
        }

        $student->update($updateData);

        return back()->with('success', "تم تفعيل حساب الطالب {$student->name} بنجاح ✅");
    }

    /**
     * رفض وحذف طلب الطالب المعلق
     */
    public function reject(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $name = $student->name;
        $student->delete();

        return back()->with('success', "تم رفض وحذف طلب {$name} بنجاح 🗑️");
    }

    /**
     * حذف حساب الطالب نهائياً من قاعدة البيانات (بناءً على طلبك)
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $name = $student->name;
        $student->delete();

        return redirect()->back()->with('success', "تم حذف حساب الطالب {$name} نهائياً بنجاح 🗑️");
    }
}