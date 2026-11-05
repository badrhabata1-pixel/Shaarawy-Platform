<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\SheetAnswer;
use App\Models\SheetResponse;
use App\Models\ExamResult;
use App\Models\Group;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GradingController extends Controller
{
    /* ── 1. SHEETS GRADING ── */

    public function pendingSheets()
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();
        $groupIds  = Group::where('assistant_id', $assistant->id)->pluck('id');

        $pending = SheetAnswer::with(['student:id,name,image', 'sheet:id,title'])
            ->where('status', 'pending')
            ->whereHas('student', fn($q) => $q->whereIn('group_id', $groupIds))
            ->orderByDesc('id')
            ->get()
            ->map(fn($sa) => [
                'id'           => $sa->id,
                'sheet_title'  => $sa->sheet?->title,
                'student_name' => $sa->student?->name,
                'student_image'=> $sa->student?->image,
                'status'       => $sa->status,
                'submitted_at' => $sa->created_at?->format('Y-m-d H:i'),
                'essay_count'  => 1,
            ]);

        return Inertia::render('Assistant/Grading/PendingSheets', [
            'pending'   => $pending,
            'assistant' => $assistant,
        ]);
    }

    public function gradeSheetForm($id)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant  = Auth::guard('assistant')->user();
        $sheetAnswer = SheetAnswer::with([
            'student:id,name,image',
            'sheet:id,title,total_marks',
            'responses.question',
        ])->findOrFail($id);

        $essayResponses = $sheetAnswer->responses
            ->map(fn($r) => [
                'id'             => $r->id,
                'question_id'    => $r->question_id,
                'question_text'  => $r->question?->question_text ?? 'السؤال المقالي المرفق بالشيت',
                'model_answer'   => $r->question?->correct_answer ?? 'الإجابة النموذجية المحددة للواجب',
                'max_marks'      => $r->question?->marks ?? 5,
                'student_answer' => $r->student_answer ?? 'إجابة الطالب المدخلة بالشيت',
                'answer_image'   => $r->answer_image,
                'is_correct'     => $r->is_correct ?? false,
                'marks_awarded'  => $r->marks_awarded ?? 0,
                'teacher_note'   => $r->teacher_note,
            ])->values();

        return Inertia::render('Assistant/Grading/GradeSheetForm', [
            'sheetAnswer'    => [
                'id'           => $sheetAnswer->id,
                'sheet_title'  => $sheetAnswer->sheet?->title,
                'total_marks'  => $sheetAnswer->sheet?->total_marks ?? 10,
                'student_name' => $sheetAnswer->student?->name,
                'student_image'=> $sheetAnswer->student?->image,
                'feedback'     => $sheetAnswer->feedback,
                'total_score'  => $sheetAnswer->total_score,
                'status'       => $sheetAnswer->status,
            ],
            'responses'      => $essayResponses,
            'assistant'      => $assistant,
        ]);
    }

    public function saveSheetGrade(Request $request, $id)
    {
        $validated = $request->validate([
            'grades'   => ['required', 'array'],
            'grades.*.response_id' => ['required', 'integer'],
            'grades.*.is_correct'  => ['required', 'boolean'],
            'feedback' => ['nullable', 'string', 'max:2000'],
        ]);

        $sheetAnswer = SheetAnswer::findOrFail($id);
        $assistant   = Auth::guard('assistant')->user();

        $totalEarnedExtra = 0;

        foreach ($validated['grades'] as $grade) {
            $response = SheetResponse::find($grade['response_id']);
            if (!$response) continue;

            $maxMarks   = 5;
            $marksAwarded = $grade['is_correct'] ? $maxMarks : 0;

            $response->update([
                'marks_awarded' => $marksAwarded,
                'graded_at'     => now(),
            ]);

            $totalEarnedExtra += $marksAwarded;
        }

        $sheetAnswer->update([
            'total_score' => $totalEarnedExtra,
            'status'      => 'graded',
        ]);

        return redirect()->route('assistant.sheets.pending')
            ->with('success', 'تم حفظ الدرجات بنجاح ✅');
    }

    /* ── 2. EXAMS GRADING (مصحح وشامل لربط طلاب المجموعات والـ Online كلياً) ── */

    /**
     * عرض قائمة امتحانات الطلاب (تضم طلاب المساعد بالإضافة لـ جميع طلاب الأونلاين)
     */
    public function pendingExams(Request $request)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        $search = $request->input('search');
        $selectedExamId = $request->input('exam_id');

        // Exam results are already submitted attempts. Keep this list global so
        // the secretary can review and reopen students outside assigned groups.
        $query = ExamResult::with(['student:id,name,image', 'exam:id,title,total_marks'])
            ->whereNotNull('finished_at')
            ->whereHas('student')
            ->whereHas('exam');

        if (!empty($search)) {
            $query->whereHas('student', fn($q) => $q->where('name', 'LIKE', "%{$search}%"));
        }

        if (!empty($selectedExamId)) {
            $query->where('exam_id', $selectedExamId);
        }

        $pending = $query->orderByDesc('id')->get()->map(fn($er) => [
            'id'           => $er->id,
            'exam_title'   => $er->exam?->title ?? 'اختبار دوري',
            'student_name' => $er->student?->name,
            'status'       => $er->status,
            'score'        => $er->score,
            'total_marks'  => $er->exam?->total_marks ?? 10,
            'finished_at'  => $er->finished_at?->format('Y-m-d H:i'),
        ]);

        // جلب قائمة الامتحانات لعرضها في قائمة الاختيار
        $examsList = Exam::get(['id', 'title']);

        return Inertia::render('Assistant/Grading/PendingExams', [
            'pending'    => $pending,
            'assistant'  => $assistant,
            'exams_list' => $examsList,
            'filters'    => [
                'search'  => $search,
                'exam_id' => $selectedExamId ? (int)$selectedExamId : null,
            ]
        ]);
    }

    /**
     * عرض ورقة إجابة الطالب وتصحيحها
     */
    public function gradeExamForm($id)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant  = Auth::guard('assistant')->user();
        $examResult = ExamResult::with([
            'student:id,name,image',
            'exam:id,title,total_marks',
            'responses.question',
        ])->findOrFail($id);

        $essayResponses = $examResult->responses
            ->map(fn($r) => [
                'id'             => $r->id,
                'question_id'    => $r->question_id,
                'question_type'  => $r->question?->question_type ?? 'essay',
                'question_text'  => $r->question?->question_text ?? 'السؤال المقالي للامتحان الدوري',
                'model_answer'   => $r->question?->correct_answer ?? 'الإجابة النموذجية المحددة للامتحان',
                'max_marks'      => $r->question?->marks ?? 5,
                'student_answer' => $r->selected_answer ?? $r->student_answer ?? 'لم يجب الطالب',
                'is_correct'     => $r->is_correct,
                'marks_awarded'  => $r->marks_awarded,
                'teacher_note'   => $r->teacher_note,
            ])->values();

        return Inertia::render('Assistant/Grading/GradeExamForm', [
            'examResult' => [
                'id'           => $examResult->id,
                'exam_title'   => $examResult->exam?->title,
                'total_marks'  => $examResult->exam?->total_marks ?? 10,
                'student_name' => $examResult->student?->name,
                'student_image'=> $examResult->student?->image,
                'current_score'=> $examResult->score,
                'status'       => $examResult->status,
            ],
            'responses'  => $essayResponses,
            'assistant'  => $assistant,
        ]);
    }

    /**
     * حفظ درجات وإجابات الامتحان
     */
    public function saveExamGrade(Request $request, $id)
    {
        $validated = $request->validate([
            'grades'               => ['required', 'array'],
            'grades.*.response_id' => ['required', 'integer', 'distinct'],
            'grades.*.is_correct'  => ['required', 'boolean'],
            'grades.*.teacher_note'=> ['nullable', 'string', 'max:500'],
        ]);

        $assistant  = Auth::guard('assistant')->user();
        DB::transaction(function () use ($id, $assistant, $validated) {
            $examResult = ExamResult::with(['exam', 'responses.question'])
                ->lockForUpdate()
                ->findOrFail($id);

            $essayResponses = $examResult->responses->filter(
                fn ($response) => ($response->question?->question_type ?? 'essay') !== 'mcq'
            );
            $grades = collect($validated['grades'])->keyBy('response_id');

            foreach ($essayResponses as $response) {
                if (!$grades->has($response->id)) {
                    throw ValidationException::withMessages([
                        'grades' => 'يجب تصحيح كل الأسئلة المقالية قبل حفظ النتيجة.',
                    ]);
                }
            }

            $essayIds = $essayResponses->pluck('id')->map(fn ($value) => (int) $value)->all();
            if ($grades->keys()->diff($essayIds)->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'grades' => 'يمكن تعديل تصحيح الأسئلة المقالية فقط.',
                ]);
            }

            $totalScore = 0;
            foreach ($examResult->responses as $response) {
                $maxMarks = (int) ($response->question?->marks ?? 0);
                $isMcq = ($response->question?->question_type ?? 'essay') === 'mcq';

                if ($isMcq) {
                    $isCorrect = (bool) $response->is_correct;
                    $marksAwarded = $isCorrect ? $maxMarks : 0;
                    $response->update(['marks_awarded' => $marksAwarded]);
                } else {
                    $grade = $grades->get($response->id);
                    $isCorrect = (bool) $grade['is_correct'];
                    $marksAwarded = $isCorrect ? $maxMarks : 0;
                    $response->update([
                        'is_correct'    => $isCorrect,
                        'marks_awarded' => $marksAwarded,
                        'teacher_note'  => $grade['teacher_note'] ?? null,
                        'graded_by'     => $assistant->id,
                        'graded_at'     => now(),
                    ]);
                }

                $totalScore += $marksAwarded;
            }

            $exam = $examResult->exam;
            $passRatio = ($exam?->exam_mode ?? 'final') === 'gate' ? 0.5 : 0.7;
            $passMark = (float) ($exam?->total_marks ?? 0) * $passRatio;

            $examResult->update([
                'score'  => $totalScore,
                'status' => $totalScore >= $passMark ? 'passed' : 'failed',
            ]);
        });

        return redirect()->route('assistant.exams.pending')
            ->with('success', 'تم حفظ درجات الامتحان بنجاح ✅');
    }
}
