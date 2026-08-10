<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Notification;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $assistant = Auth::guard('assistant')->user();

        $notifications = Notification::with(['academicYear:id,name', 'student:id,name'])
            ->orderByDesc('id')
            ->get()
            ->map(fn($n) => [
                'id'           => $n->id,
                'text'         => $n->text,
                'sender_name'  => $n->sender_name,
                'academic_year'=> $n->academicYear?->name ?? 'جميع الطلاب 🌐',
                'student_name' => $n->student?->name,
                'created_at'   => $n->created_at->diffForHumans(),
            ]);

        $academicYears = AcademicYear::orderBy('level')->get(['id', 'name']);

        // كل الطلاب النشطين مع الـ academic_year_id لفلترة الفرونت‑اند
        $students = Student::where('is_active', true)
            ->whereNotNull('academic_year_id')
            ->orderBy('name')
            ->get(['id', 'name', 'academic_year_id']);

        return Inertia::render('Assistant/Notifications/Index', [
            'assistant'      => $assistant,
            'notifications'  => $notifications,
            'academic_years' => $academicYears,
            'students'       => $students,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'text'             => 'required|string|max:1000',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'student_id'       => 'nullable|exists:students,id',
        ]);

        $assistant = Auth::guard('assistant')->user();

        Notification::create([
            'title'            => 'تنبيه هام',
            'text'             => $request->text,
            'sender_name'      => 'السكرتارية: ' . $assistant->name,
            'academic_year_id' => $request->academic_year_id ?: null,
            'student_id'       => $request->student_id ?: null,
        ]);

        return back()->with('success', 'تم إرسال التنبيه بنجاح! 📢');
    }

    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return back()->with('success', 'تم حذف التنبيه بنجاح ✓');
    }
}
