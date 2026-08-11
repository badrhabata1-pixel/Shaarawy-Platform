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

        $now   = now();
        $exams = Exam::where('class_id', $student->academic_year_id)
            ->with(['lesson:id,title', 'results' => fn ($q) =>
                $q->where('student_id', $student->id)->orderByDesc('id')
            ])
            ->orderByDesc('start_time')
            ->get();

        $list = $exams->map(function (Exam $exam) use ($now) {
            // Latest result (not first attempt)
            $result    = $exam->results->first();
            $examMode  = $exam->exam_mode ?? 'final';
            $passMark  = $exam->total_marks * ($examMode === 'gate' ? 0.5 : 0.7);
            // For gate exams: show "can retake" if latest result is failed
            $canRetake = $examMode === 'gate'
                && $result
                && $result->status === 'failed';

            if ($exam->start_time && $exam->end_time) {
                if ($now->lt($exam->start_time)) {
                    $status = 'upcoming';
                } elseif ($now->gt($exam->end_time)) {
                    $status = 'ended';
                } else {
                    $status = 'active';
                }
            } else {
                $status = 'open';
            }

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

        return Inertia::render('Student/ExamShow', [
            'exam'   => array_merge($exam->toArray(), [
                'exam_mode' => $examMode,
                'pass_mark' => $passMark,
                'can_retake' => $examMode === 'gate' && $result && $result->status === 'failed',
            ]),
            'result' => $result ? [
                'id'          => $result->id,
                'score'       => $result->score,
                'status'      => $result->status,
                'finished_at' => $result->finished_at?->format('Y-m-d H:i'),
                'responses'   => $result->responses->map(fn ($r) => [
                    'question_id'     => $r->question_id,
                    'selected_answer' => $r->selected_answer,
                    'is_correct'      => $r->is_correct,
                ]),
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

        // Block based on exam mode
        $examMode = $exam->exam_mode ?? 'final';
        if ($examMode === 'final') {
            // Final exam: one attempt only
            if (ExamResult::where('exam_id', $exam->id)->where('student_id', $student->id)->exists()) {
                return redirect()->route('student.exams.show', $exam->id);
            }
        } else {
            // Gate exam: allow retakes until passed
            $alreadyPassed = ExamResult::where('exam_id', $exam->id)
                ->where('student_id', $student->id)
                ->where('status', 'passed')
                ->exists();
            if ($alreadyPassed) {
                return redirect()->route('student.exams.show', $exam->id);
            }
        }

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
  


