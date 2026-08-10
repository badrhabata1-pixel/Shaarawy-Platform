<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\TopStudent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TopStudentAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TopStudents/Index', [
            'topStudents' => TopStudent::with('student:id,name')->orderBy('rank')->get(),
            'students'    => Student::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'rank'       => ['required', 'integer'],
            'notes'      => ['nullable', 'string'],
        ]);

        $student = Student::findOrFail($request->student_id);

        TopStudent::updateOrCreate(
            [
                'student_id'       => $student->id,
                'academic_year_id' => $student->academic_year_id,
                'month'            => now()->format('Y-m'),
            ],
            [
                'rank'  => $request->rank,
                'notes' => $request->notes,
            ]
        );

        return redirect()->route('admin.top-students.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function destroy($id)
    {
        TopStudent::findOrFail($id)->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
