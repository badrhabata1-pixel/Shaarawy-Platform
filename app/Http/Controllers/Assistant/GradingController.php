<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\SheetAnswer;
use App\Models\SheetResponse;
use App\Models\ExamResult;
use App\Models\ExamResponse;
use App\Models\Group;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $groupIds  = Group::where('assistant_id', $assistant->id)->pluck('id');

        $search = $request->input('search');
        $selectedExamId = $request->input('exam_id');

        // استعلام شامل يربط طلاب السناتر بالمساعد الحالي وطلاب الأونلاين المفتوحين لجميع السكرتارية
        $query = ExamResult::with(['student:id,name,image', 'exam:id,title,total_marks'])
            ->whereHas('student', function($q) use ($groupIds) {
                $q->whereIn('group_id', $groupIds)
                  ->orWhere('student_type', 'online'); // إدراج طلاب الأونلاين بنجاح!
            });

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
            'finished_at'  => $er->created_at?->format('Y-m-d H:i'),
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
                'question_text'  => $r->question?->question_text ?? 'السؤال المقالي للامتحان الدوري',
                'model_answer'   => $r->question?->correct_answer ?? 'الإجابة النموذجية المحددة للامتحان',
                'max_marks'      => $r->question?->marks ?? 5,
                'student_answer' => $r->selected_answer ?? $r->student_answer ?? 'لم يجب الطالب',
                'is_correct'     => $r->is_correct ?? false,
                'marks_awarded'  => $r->marks_awarded ?? 0,
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
            'grades.*.response_id' => ['required', 'integer'],
            'grades.*.is_correct'  => ['required', 'boolean'],
            'grades.*.teacher_note'=> ['nullable', 'string', 'max:500'],
            'manual_total_score'   => ['required', 'integer', 'min:0'],
        ]);

        $examResult = ExamResult::findOrFail($id);
        $assistant  = Auth::guard('assistant')->user();

        $essayScore = 0;

        foreach ($validated['grades'] as $grade) {
            $response = ExamResponse::find($grade['response_id']);
            if (!$response) continue;

            $maxMarks     = 5;
            $marksAwarded = $grade['is_correct'] ? $maxMarks : 0;

            $response->update([
                'teacher_note'  => $grade['teacher_note'] ?? null,
                'graded_at'     => now(),
            ]);

            $essayScore += $marksAwarded;
        }

        $examResult->update([
            'score'  => $essayScore,
            'status' => 'passed',
        ]);

        return redirect()->route('assistant.exams.pending')
            ->with('success', 'تم حفظ درجات الامتحان بنجاح ✅');
    }
}