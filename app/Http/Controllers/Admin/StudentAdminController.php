<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Group;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Students/Index', [
            'students'      => Student::with(['academicYear:id,name', 'group:id,name'])->orderByDesc('id')->get(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'groups'        => Group::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Students/Form', [
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'groups'        => Group::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', 'unique:students,email'],
            'phone'            => ['nullable', 'string', 'max:50'],
            'parent_phone'     => ['nullable', 'string', 'max:50'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'group_id'         => ['nullable', 'exists:groups,id'],
            'student_type'     => ['required', 'in:online,offline'],
            'governorate'      => ['nullable', 'string', 'max:255'],
            'is_active'        => ['boolean'],
            'image'            => ['nullable', 'image', 'max:3072'],
            'password'         => ['required', 'string', 'min:6'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('students', 'public');
        }

        $data['password'] = bcrypt($data['password']);
        // Admin-created students are immediately active
        $data['status'] = 'active';

        Student::create($data);

        return redirect()->route('admin.students.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Student $student)
    {
        return Inertia::render('Admin/Students/Form', [
            'item'          => $student,
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'groups'        => Group::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', 'unique:students,email,' . $student->id],
            'phone'            => ['nullable', 'string', 'max:50'],
            'parent_phone'     => ['nullable', 'string', 'max:50'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'group_id'         => ['nullable', 'exists:groups,id'],
            'student_type'     => ['required', 'in:online,offline'],
            'governorate'      => ['nullable', 'string', 'max:255'],
            'is_active'        => ['boolean'],
            'image'            => ['nullable', 'image', 'max:3072'],
            'password'         => ['nullable', 'string', 'min:6'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('students', 'public');
        } else {
            unset($data['image']);
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $student->update($data);

        return redirect()->route('admin.students.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }

    public function toggleActive(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update(['is_active' => !$student->is_active]);

        return back()->with('success', 'تم تغيير الحالة بنجاح ✓');
    }

    public function requests()
    {
        return Inertia::render('Admin/Students/Requests', [
            'students' => Student::with(['academicYear:id,name', 'group:id,name'])
                ->where('status', 'pending')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function approve($id)
    {
        $student = Student::findOrFail($id);
        $student->update(['is_active' => 1, 'status' => 'active']);

        return back()->with('success', 'تم قبول الطالب');
    }

    public function reject($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return back()->with('success', 'تم رفض الطالب');
    }
}
