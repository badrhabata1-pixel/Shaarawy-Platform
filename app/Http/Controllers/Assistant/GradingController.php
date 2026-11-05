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
            'exam.questions',
            'responses.question',
        ])->findOrFail($id);

        $responsesByQuestion = $examResult->responses->keyBy('question_id');
        $examQuestions = $examResult->exam?->questions ?? collect();
        $questionTotalMarks = (float) $examQuestions->sum('marks');
        $actualTotalMarks = $questionTotalMarks > 0
            ? $questionTotalMarks
            : (float) ($examResult->exam?->total_marks ?? 10);
        $knownMcqScore = $examResult->responses->sum(function ($response) {
            return $response->question?->question_type === 'mcq' && $response->is_correct
                ? (int) ($response->question?->marks ?? 0)
                : 0;
        });
        $previousEssayScore = $examResult->responses->sum(function ($response) {
            return $response->question?->question_type !== 'mcq'
                ? (int) ($response->marks_awarded ?? 0)
                : 0;
        });
        $missingMcqQuestions = $examQuestions->filter(
            fn ($question) => $question->question_type === 'mcq' && !$responsesByQuestion->has($question->id)
        );
        $unmatchedMcqScore = max(0, (int) $examResult->score - $knownMcqScore - $previousEssayScore);
        $inferredMissingMcqResult = null;
        if ($examResult->status === 'pending' && $missingMcqQuestions->count() === 1) {
            $missingQuestion = $missingMcqQuestions->first();
            $inferredMissingMcqResult = [
                'question_id' => $missingQuestion->id,
                'is_correct' => $unmatchedMcqScore >= (int) $missingQuestion->marks,
            ];
        }

        $essayResponses = $examQuestions->map(function ($question) use ($responsesByQuestion, $inferredMissingMcqResult) {
            $response = $responsesByQuestion->get($question->id);
            $inferredCorrect = !$response
                && $inferredMissingMcqResult
                && $inferredMissingMcqResult['question_id'] === $question->id
                    ? $inferredMissingMcqResult['is_correct']
                    : null;

            return [
                // The question id is the stable key, even if an old attempt has
                // no response row for an unanswered question.
                'id'             => $question->id,
                'question_id'    => $question->id,
                'response_id'    => $response?->id,
                'question_type'  => $question->question_type,
                'question_text'  => $question->question_text,
                'model_answer'   => $question->correct_answer,
                'max_marks'      => $question->marks,
                'student_answer' => $response?->selected_answer ?? 'لم تُسجل الإجابة في المحاولة',
                'is_correct'     => $response?->is_correct ?? $inferredCorrect,
                'marks_awarded'  => $response?->marks_awarded ?? ($inferredCorrect === null ? null : ($inferredCorrect ? $question->marks : 0)),
                'teacher_note'   => $response?->teacher_note,
            ];
        })->values();

        return Inertia::render('Assistant/Grading/GradeExamForm', [
            'examResult' => [
                'id'           => $examResult->id,
                'exam_title'   => $examResult->exam?->title,
                'total_marks'  => $actualTotalMarks,
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
            'grades'               => ['nullable', 'array'],
            'grades.*.question_id' => ['required', 'integer', 'distinct'],
            'grades.*.is_correct'  => ['required', 'boolean'],
            'grades.*.teacher_note'=> ['nullable', 'string', 'max:500'],
            'final_score'          => ['nullable', 'numeric', 'min:0'],
        ]);

        $assistant  = Auth::guard('assistant')->user();
        DB::transaction(function () use ($id, $assistant, $validated) {
            $examResult = ExamResult::with(['exam.questions', 'responses.question'])
                ->lockForUpdate()
                ->findOrFail($id);

            $questions = $examResult->exam?->questions ?? collect();
            $grades = collect($validated['grades'] ?? [])->keyBy('question_id');

            $questionIds = $questions->pluck('id')->map(fn ($value) => (int) $value)->all();
            if ($grades->keys()->diff($questionIds)->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'grades' => 'يمكن تعديل تصحيح الأسئلة المقالية فقط.',
                ]);
            }

            $responsesByQuestion = $examResult->responses->keyBy('question_id');
            $knownMcqScore = $examResult->responses->sum(function ($response) {
                return $response->question?->question_type === 'mcq' && $response->is_correct
                    ? (int) ($response->question?->marks ?? 0)
                    : 0;
            });
            $previousEssayScore = $examResult->responses->sum(function ($response) {
                return $response->question?->question_type !== 'mcq'
                    ? (int) ($response->marks_awarded ?? 0)
                    : 0;
            });
            $missingMcqQuestions = $questions->filter(
                fn ($question) => $question->question_type === 'mcq' && !$responsesByQuestion->has($question->id)
            );
            $unmatchedMcqScore = max(0, (int) $examResult->score - $knownMcqScore - $previousEssayScore);
            $inferredMissingMcq = null;
            if ($examResult->status === 'pending' && $missingMcqQuestions->count() === 1) {
                $inferredMissingMcq = $unmatchedMcqScore >= (int) $missingMcqQuestions->first()->marks;
            }
            $autoScore = max($knownMcqScore, (int) $examResult->score - $previousEssayScore);
            $essayScore = 0;
            $allEssaysGraded = true;
            foreach ($questions as $question) {
                $response = $responsesByQuestion->get($question->id);
                $maxMarks = (int) $question->marks;
                $isMcq = $question->question_type === 'mcq';

                if ($isMcq) {
                    $isCorrect = (bool) ($response?->is_correct ?? false);
                    $marksAwarded = $isCorrect ? $maxMarks : 0;
                    if ($response) {
                        $response->update(['marks_awarded' => $marksAwarded]);
                    } elseif ($missingMcqQuestions->count() === 1 && $inferredMissingMcq !== null) {
                        $marksAwarded = $inferredMissingMcq ? $maxMarks : 0;
                        ExamResponse::create([
                            'exam_result_id' => $examResult->id,
                            'question_id'    => $question->id,
                            'selected_answer'=> $inferredMissingMcq ? $question->correct_answer : null,
                            'is_correct'     => $inferredMissingMcq,
                            'marks_awarded'  => $marksAwarded,
                        ]);
                    } else {
                        ExamResponse::create([
                            'exam_result_id' => $examResult->id,
                            'question_id'    => $question->id,
                            'selected_answer'=> null,
                            'is_correct'     => null,
                            'marks_awarded'  => null,
                        ]);
                    }
                } else {
                    $grade = $grades->get($question->id);
                    if (!$grade) {
                        if (!$response || !$response->graded_at) {
                            $allEssaysGraded = false;
                        }
                        $essayScore += (int) ($response?->marks_awarded ?? 0);
                        continue;
                    }

                    $isCorrect = (bool) $grade['is_correct'];
                    $marksAwarded = $isCorrect ? $maxMarks : 0;
                    $responseData = [
                        'is_correct'    => $isCorrect,
                        'marks_awarded' => $marksAwarded,
                        'teacher_note'  => $grade['teacher_note'] ?? null,
                        'graded_by'     => $assistant->id,
                        'graded_at'     => now(),
                    ];
                    if ($response) {
                        $response->update($responseData);
                    } else {
                        ExamResponse::create($responseData + [
                            'exam_result_id' => $examResult->id,
                            'question_id'    => $question->id,
                            'selected_answer'=> null,
                        ]);
                    }
                }

                if (!$isMcq) {
                    $essayScore += $marksAwarded;
                }
            }

            $exam = $examResult->exam;
            $actualTotalMarks = max(1, (float) $questions->sum('marks'));
            if ($exam && (float) $exam->total_marks !== $actualTotalMarks) {
                $exam->update(['total_marks' => $actualTotalMarks]);
            }
            $passRatio = ($exam?->exam_mode ?? 'final') === 'gate' ? 0.5 : 0.7;
            $passMark = $actualTotalMarks * $passRatio;
            $calculatedScore = $autoScore + $essayScore;
            $finalScore = array_key_exists('final_score', $validated) && $validated['final_score'] !== null
                ? min((float) $validated['final_score'], $actualTotalMarks)
                : $calculatedScore;

            $examResult->update([
                'score'  => $finalScore,
                'status' => !$allEssaysGraded
                    ? 'pending'
                    : ($finalScore >= $passMark ? 'passed' : 'failed'),
            ]);
        });

        return redirect()->route('assistant.exams.pending')
            ->with('success', 'تم حفظ درجات الامتحان بنجاح ✅');
    }
}
