<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ExamGradeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ExamGrades/Index', [
            'grades' => ExamResult::with([
                'student:id,name',
                'exam:id,title',
            ])->orderByDesc('id')->get(),
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::transaction(function () use ($id) {
            $selected = ExamResult::lockForUpdate()->findOrFail($id);
            $attempts = ExamResult::where('student_id', $selected->student_id)
                ->where('exam_id', $selected->exam_id)
                ->lockForUpdate()
                ->get();

            foreach ($attempts as $attempt) {
                $attempt->responses()->delete();
            }
            ExamResult::whereIn('id', $attempts->pluck('id'))->delete();
        });

        return back()->with('success', 'تم حذف نتائج الطالب في هذا الامتحان، ويمكنه البدء من جديد.');
    }
}
