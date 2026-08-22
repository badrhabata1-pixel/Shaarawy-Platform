<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * عرض صفحة تسجيل الطالب مع تمرير الصفوف الدراسية المتاحة
     */
    public function create()
    {
        $grades = AcademicYear::orderBy('level')->get(['id', 'name']);
        return Inertia::render('StudentRegister', ['grades' => $grades]);
    }

    /**
     * استقبال بيانات الطالب وحفظها كحساب معلق بانتظار مراجعة السكرتارية
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'       => 'required|string|max:100',
            'last_name'        => 'required|string|max:100',
            'email'            => 'required|email|unique:students,email',
            'password'         => 'required|string|min:8',
            'phone'            => 'required|string|max:20',
            'parent_phone'     => 'required|string|max:20',
            'type'             => 'required|in:online,offline',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);

        // يُحفظ الطالب كحساب معلق (pending) وغير نشط (is_active = false) ليظهر للسكرتارية يدوياً
        Student::create([
            'name'             => $fullName,
            'email'            => $validated['email'],
            'password'         => Hash::make($validated['password']),
            'phone'            => $validated['phone'],
            'parent_phone'     => $validated['parent_phone'],
            'student_type'     => $validated['type'],
            'academic_year_id' => $validated['academic_year_id'] ?? null,
            'status'           => 'pending', // بانتظار المراجعة
            'is_active'        => false,     // غير نشط حتى تفعله السكرتارية يدوياً
        ]);

        return redirect()->route('student.login')
            ->with('success', 'تم تسجيل حسابك بنجاح وعرضه للمراجعة! يرجى الانتظار لحين تفعيله من السكرتارية.');
    }

    /**
     * عرض صفحة الملف الشخصي للطالب
     */
    public function profileEdit()
    {
        /** @var \App\Models\Student $student */
        $student = auth()->guard('student')->user();
        
        $parts = explode(' ', trim($student->name));
        $firstName = $parts[0] ?? '';
        $lastName = count($parts) > 1 ? end($parts) : '';

        return Inertia::render('Student/StudentProfile', [
            'student' => [
                'first_name' => $firstName,
                'last_name'  => $lastName,
                'email'      => $student->email,
                'phone'      => $student->phone,
                'avatar'     => $student->image ? asset('uploads/students/' . $student->image) : null,
            ]
        ]);
    }

    /**
     * تحديث بيانات وصورة الطالب الشخصية
     */
    public function profileUpdate(Request $request)
    {
        /** @var \App\Models\Student $student */
        $student = auth()->guard('student')->user();

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'phone'      => 'required|string|max:20',
            'avatar'     => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $student->name = trim($request->first_name . ' ' . $request->last_name);
        $student->phone = $request->phone;

        if ($request->hasFile('avatar')) {
            $image = $request->file('avatar');
            $imageName = 'avatar_' . $student->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            
            if (!file_exists(public_path('uploads/students'))) {
                mkdir(public_path('uploads/students'), 0777, true);
            }
            
            $image->move(public_path('uploads/students'), $imageName);
            $student->image = $imageName;
        }

        $student->save();

        return redirect()->back()->with('success', 'تم تحديث بياناتك بنجاح ✅');
    }
}