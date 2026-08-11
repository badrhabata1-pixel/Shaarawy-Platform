<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Group;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Show attendance tracker: group selector + student roster with present/absent toggles.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        $myGroups = Group::where('assistant_id', $assistant->id)
            ->with('academicYear:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'hour', 'academic_year_id'])
            ->map(fn($g) => [
                'id'   => $g->id,
                'name' => $g->name . ($g->hour ? " ({$g->hour})" : ''),
                'year' => $g->academicYear?->name,
            ]);

        $selectedGroupId = $request->input('group_id');
        $lessonDate      = $request->input('lesson_date', now()->format('Y-m-d'));

        $students  = [];
        $attendance = [];

        if ($selectedGroupId) {
            // Validate the group belongs to this assistant
            $group = Group::where('id', $selectedGroupId)
                ->where('assistant_id', $assistant->id)
                ->firstOrFail();

            $students = Student::where('group_id', $selectedGroupId)
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'center_code', 'student_type', 'phone'])
                ->map(fn($s) => [
                    'id'           => $s->id,
                    'name'         => $s->name,
                    'center_code'  => $s->center_code,
                    'student_type' => $s->student_type,
                    'phone'        => $s->phone,
                ]);

            // Fetch existing attendance records for this group + date
            $existingAttendance = Attendance::where('group_id', $selectedGroupId)
                ->where('lesson_date', $lessonDate)
                ->get()
                ->keyBy('student_id');

            foreach ($students as $student) {
                $record = $existingAttendance->get($student['id']);
                $attendance[$student['id']] = [
                    'attendance_id' => $record?->id,
                    'status'        => $record?->status ?? 'absent',
                    'note'          => $record?->note,
                ];
            }
        }

        return Inertia::render('Assistant/Attendance', [
            'assistant'       => $assistant,
            'my_groups'       => $myGroups,
            'students'        => $students,
            'attendance'      => $attendance,
            'selected_group'  => $selectedGroupId ? (int)$selectedGroupId : null,
            'lesson_date'     => $lessonDate,
        ]);
    }

    /**
     * Save or update attendance records for a group on a specific date.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id'    => ['required', 'exists:groups,id'],
            'lesson_date' => ['required', 'date'],
            'attendance'  => ['required', 'array'],
            'attendance.*.student_id' => ['required', 'exists:students,id'],
            'attendance.*.status'     => ['required', 'in:present,absent,late'],
            'attendance.*.note'       => ['nullable', 'string', 'max:255'],
        ]);

        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        // Validate group belongs to this assistant
        Group::where('id', $validated['group_id'])
            ->where('assistant_id', $assistant->id)
            ->firstOrFail();

        foreach ($validated['attendance'] as $record) {
            Attendance::updateOrCreate(
                [
                    'group_id'    => $validated['group_id'],
                    'student_id'  => $record['student_id'],
                    'lesson_date' => $validated['lesson_date'],
                ],
                [
                    'status'      => $record['status'],
                    'note'        => $record['note'] ?? null,
                    'recorded_by' => $assistant->id,
                ]
            );
        }

        return back()->with('success', 'تم حفظ الحضور بنجاح ✅');
    }
}
