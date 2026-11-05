<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamGradeController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $query = ExamResult::with(['student:id,name', 'exam:id,title,total_marks']);

        if ($search !== '') {
            $query->whereHas('student', fn ($students) => $students->where('name', 'like', "%{$search}%"));
        }

        return Inertia::render('Assistant/ExamGrades/Index', [
            'grades' => $query->orderByDesc('id')->get(),
            'filters' => ['search' => $search],
            'assistant' => auth()->guard('assistant')->user(),
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
