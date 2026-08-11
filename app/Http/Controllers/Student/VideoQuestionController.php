<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\VideoQuestion;
use App\Models\VideoQuestionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoQuestionController extends Controller
{
    /**
     * GET /student/lessons/{lesson}/video-questions
     * Returns 4 questions (no correct_answer) for the client.
     */
    public function index(Lesson $lesson)
    {
        $questions = VideoQuestion::where('lesson_id', $lesson->id)
            ->orderBy('position')
            ->get(['id', 'question_text', 'options', 'position']);

        return response()->json($questions->values());
    }

    /**
     * POST /student/lessons/{lesson}/video-questions/{question}/trigger
     * Called when the overlay appears — logs that the student saw the question.
     */
    public function trigger(Lesson $lesson, VideoQuestion $question)
    {
        $student = Auth::guard('student')->user();

        VideoQuestionLog::firstOrCreate(
            ['student_id' => $student->id, 'video_question_id' => $question->id],
            [
                'lesson_id'    => $lesson->id,
                'is_answered'  => false,
                'triggered_at' => now(),
            ]
        );

        return response()->json(['ok' => true]);
    }

    /**
     * POST /student/lessons/{lesson}/video-questions/{question}/answer
     * Records the student's answer and returns correctness.
     */
    public function answer(Request $request, Lesson $lesson, VideoQuestion $question)
    {
        $request->validate(['option' => 'required|in:a,b,c,d']);

        $student   = Auth::guard('student')->user();
        $chosen    = $request->input('option');
        $isCorrect = ($chosen === $question->correct_answer);

        VideoQuestionLog::updateOrCreate(
            ['student_id' => $student->id, 'video_question_id' => $question->id],
            [
                'lesson_id'     => $lesson->id,
                'is_answered'   => true,
                'chosen_option' => $chosen,
                'is_correct'    => $isCorrect,
                'answered_at'   => now(),
            ]
        );

        return response()->json([
            'is_correct'     => $isCorrect,
            'correct_answer' => $question->correct_answer,
        ]);
    }
}
