<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $exams = Exam::where('class_id', $student->academic_year_id)
            ->with(['lesson:id,title', 'results' => fn ($q) =>
                $q->where('student_id', $student->id)->orderByDesc('id')
            ])
            ->orderByDesc('start_time')
            ->get();

        $list = $exams->map(function (Exam $exam) {
            // Latest result (not first attempt)
            $result    = $exam->results->first();
            $examMode  = $exam->exam_mode ?? 'final';
            $passMark  = $exam->total_marks * ($examMode === 'gate' ? 0.5 : 0.7);
            $canRetake = false;

            $status = $exam->availability();

            return [
                'id'               => $exam->id,
                'title'            => $exam->title,
                'description'      => $exam->description,
                'lesson_title'     => $exam->lesson?->title,
                'time_limit'       => $exam->time_limit_minutes,
                'total_marks'      => $exam->total_marks,
                'exam_type'        => $exam->exam_type,
                'exam_mode'        => $examMode,
                'pass_mark'        => $passMark,
                'can_retake'       => $canRetake,
                'start_time'       => $exam->start_time?->format('Y-m-d H:i'),
                'end_time'         => $exam->end_time?->format('Y-m-d H:i'),
                'status'           => $status,
                'result_status'    => $result?->status,
                'result_score'     => $result?->score,
                'finished_at'      => $result?->finished_at?->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Student/Exams', [
            'exams' => $list,
        ]);
    }

    public function show($id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $exam = Exam::where('class_id', $student->academic_year_id)
            ->with([
                'questions.choices',
                'results' => fn ($q) => $q->where('student_id', $student->id)->with('responses')->orderByDesc('id'),
            ])
            ->findOrFail($id);

        // Latest result (for retake support)
        $result   = $exam->results->first();
        $examMode = $exam->exam_mode ?? 'final';
        $passMark = $exam->total_marks * ($examMode === 'gate' ? 0.5 : 0.7);

        // الامتحان مقفول قبل ميعاده وبعد انتهائه — الطالب يشوف نتيجته لو سلّم قبل كده بس
        if (!$result && !$exam->isAvailable()) {
            return redirect()->route('student.exams')
                ->with('error', $exam->availability() === 'upcoming'
                    ? 'الامتحان لسه ما بدأش — هيفتح في ' . $exam->start_time?->format('Y-m-d H:i')
                    : 'انتهى وقت هذا الامتحان.');
        }

        $reviewOpen = $exam->reviewOpen();

        $examData = $exam->toArray();
        // الإجابات الصحيحة ما تتبعتش للمتصفح إلا بعد انتهاء الامتحان (حتى أثناء الحل)
        $examData['questions'] = collect($examData['questions'] ?? [])
            ->map(function ($q) use ($reviewOpen) {
                if (!$reviewOpen) {
                    unset($q['correct_answer']);
                }
                return $q;
            })->values()->all();

        if ($result && !$reviewOpen) {
            // سلّم قبل كده والمراجعة لسه مقفولة: الدرجة بس، من غير أسئلة ولا إجابات
            $examData['questions_count'] = count($examData['questions']);
            $examData['questions']       = [];
        }

        return Inertia::render('Student/ExamShow', [
            'exam'   => array_merge($examData, [
                'exam_mode'       => $examMode,
                'pass_mark'       => $passMark,
                'can_retake'      => false,
                'review_open'     => $reviewOpen,
                'review_opens_at' => $exam->end_time?->format('Y-m-d H:i'),
            ]),
            'result' => $result ? [
                'id'          => $result->id,
                'score'       => $result->score,
                'status'      => $result->status,
                'finished_at' => $result->finished_at?->format('Y-m-d H:i'),
                'responses'   => $reviewOpen
                    ? $result->responses->map(fn ($r) => [
                        'question_id'     => $r->question_id,
                        'selected_answer' => $r->selected_answer,
                        'is_correct'      => $r->is_correct,
                        'marks_awarded'   => $r->marks_awarded,
                    ])
                    : [],
            ] : null,
        ]);
    }

    public function submit(Request $request, $id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $exam = Exam::where('class_id', $student->academic_year_id)
            ->with('questions.choices')
            ->findOrFail($id);

        // A submitted result locks the attempt until an administrator deletes it.
        if (ExamResult::where('exam_id', $exam->id)->where('student_id', $student->id)->exists()) {
            return redirect()->route('student.exams.show', $exam->id);
        }

        if (!$exam->isAvailable()) {
            return redirect()->route('student.exams')
                ->with('error', $exam->availability() === 'upcoming'
                    ? 'الامتحان لسه ما بدأش.'
                    : 'انتهى وقت هذا الامتحان ولا يمكن التسليم الآن.');
        }

        $examMode = $exam->exam_mode ?? 'final';

        $answers   = $request->input('answers', []);
        $mcqScore  = 0;
        $hasPending = false;

        $result = ExamResult::create([
            'student_id'  => $student->id,
            'exam_id'     => $exam->id,
            'score'       => 0,
            'status'      => 'pending',
            'started_at'  => now()->subMinutes($exam->time_limit_minutes),
            'finished_at' => now(),
        ]);

        foreach ($exam->questions as $question) {
            $selectedAnswer = $answers[$question->id] ?? null;
            $isCorrect      = null;

            if ($question->question_type === 'mcq') {
                $isCorrect = ($selectedAnswer !== null && $selectedAnswer === $question->correct_answer);
                if ($isCorrect) {
                    $mcqScore += $question->marks;
                }
            } else {
                $hasPending = true;
            }

            $result->responses()->create([
                'question_id'     => $question->id,
                'selected_answer' => $selectedAnswer,
                'is_correct'      => $isCorrect,
            ]);
        }

        $passMark = $exam->total_marks * ($examMode === 'gate' ? 0.5 : 0.7);
        $status   = $hasPending
            ? 'pending'
            : ($mcqScore >= $passMark ? 'passed' : 'failed');

        $result->update([
            'score'  => $mcqScore,
            'status' => $status,
        ]);

        return redirect()->route('student.exams.show', $exam->id);
    }
}
  


