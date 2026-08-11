<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\VideoQuestion;
use App\Models\VideoQuestionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoQuestionAdminController extends Controller
{
    /**
     * GET /admin/video-questions
     * All lessons overview with question + report counts.
     */
    public function index()
    {
        $lessons = Lesson::orderBy('id', 'desc')
            ->get(['id', 'title', 'duration_minutes']);

        $lessonIds = $lessons->pluck('id');

        // Count lesson-specific questions per lesson
        $qCounts = VideoQuestion::whereIn('lesson_id', $lessonIds)
            ->whereNotNull('lesson_id')
            ->selectRaw('lesson_id, count(*) as cnt')
            ->groupBy('lesson_id')
            ->pluck('cnt', 'lesson_id');

        // Count distinct students who triggered at least one question
        $studentCounts = VideoQuestionLog::whereIn('lesson_id', $lessonIds)
            ->selectRaw('lesson_id, count(distinct student_id) as cnt')
            ->groupBy('lesson_id')
            ->pluck('cnt', 'lesson_id');

        $data = $lessons->map(fn($l) => [
            'id'             => $l->id,
            'title'          => $l->title,
            'duration'       => $l->duration_minutes,
            'question_count' => $qCounts->get($l->id, 0),
            'student_count'  => $studentCounts->get($l->id, 0),
        ]);

        return Inertia::render('Admin/VideoQuestions/Index', [
            'lessons' => $data,
        ]);
    }

    /**
     * GET /admin/lessons/{lesson}/focus-report
     * Shows which students answered each in-video question.
     */
    public function focusReport(Lesson $lesson)
    {
        $logs = VideoQuestionLog::with(['student', 'question'])
            ->where('lesson_id', $lesson->id)
            ->get();

        $byStudent = $logs
            ->groupBy('student_id')
            ->map(function ($studentLogs) {
                $student = $studentLogs->first()->student;
                return [
                    'id'      => $student->id,
                    'name'    => $student->name,
                    'phone'   => $student->phone ?? '-',
                    'answers' => $studentLogs->map(fn($l) => [
                        'position'    => $l->question?->position ?? 0,
                        'is_answered' => $l->is_answered,
                        'is_correct'  => $l->is_correct,
                        'triggered'   => $l->triggered_at?->format('H:i'),
                        'answered'    => $l->answered_at?->format('H:i'),
                    ])->sortBy('position')->values(),
                ];
            })
            ->values();

        return Inertia::render('Admin/Lessons/FocusReport', [
            'lesson'    => $lesson->only('id', 'title'),
            'byStudent' => $byStudent,
        ]);
    }

    /**
     * GET /admin/lessons/{lesson}/video-questions
     * Manage lesson-specific questions.
     */
    public function questions(Lesson $lesson)
    {
        // Build video list: main + extras
        $videos = [];
        if ($lesson->video_url) {
            $videos[] = ['index' => 0, 'label' => 'الفيديو الرئيسي', 'url' => $lesson->video_url];
        }
        foreach ($lesson->extra_video_urls ?? [] as $i => $url) {
            if ($url) {
                $videos[] = ['index' => $i + 1, 'label' => 'فيديو إضافي ' . ($i + 1), 'url' => $url];
            }
        }
        // Fallback: if no videos defined, show one placeholder slot
        if (empty($videos)) {
            $videos = [['index' => 0, 'label' => 'الفيديو الرئيسي', 'url' => null]];
        }

        // Questions grouped by video_index
        $questionsByVideo = VideoQuestion::where('lesson_id', $lesson->id)
            ->orderBy('video_index')
            ->orderBy('position')
            ->get()
            ->groupBy('video_index')
            ->map(fn ($g) => $g->values())
            ->toArray();

        return Inertia::render('Admin/Lessons/VideoQuestions', [
            'lesson' => [
                'id'               => $lesson->id,
                'title'            => $lesson->title,
                'duration_minutes' => $lesson->duration_minutes,
            ],
            'videos'            => $videos,
            'questions_by_video' => $questionsByVideo,
        ]);
    }

    /**
     * POST /admin/lessons/{lesson}/video-questions
     * position auto-assigned as next available if not sent
     */
    public function store(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'question_text'  => 'required|string|max:1000',
            'options'        => 'required|array',
            'options.a'      => 'required|string|max:300',
            'options.b'      => 'required|string|max:300',
            'options.c'      => 'required|string|max:300',
            'options.d'      => 'required|string|max:300',
            'correct_answer' => 'required|in:a,b,c,d',
            'video_index'    => 'nullable|integer|min:0',
            'position'       => 'nullable|integer|min:1',
        ]);

        $videoIndex = $data['video_index'] ?? 0;

        // Auto-assign next available position within this video's question set
        $position = $data['position']
            ?? (VideoQuestion::where('lesson_id', $lesson->id)
                ->where('video_index', $videoIndex)
                ->max('position') + 1);

        VideoQuestion::create(array_merge($data, [
            'lesson_id'   => $lesson->id,
            'video_index' => $videoIndex,
            'position'    => $position,
        ]));

        return back()->with('success', 'تم حفظ السؤال بنجاح');
    }

    /**
     * PUT /admin/video-questions/{question}
     */
    public function update(Request $request, VideoQuestion $question)
    {
        $data = $request->validate([
            'question_text'  => 'required|string|max:1000',
            'options'        => 'required|array',
            'options.a'      => 'required|string|max:300',
            'options.b'      => 'required|string|max:300',
            'options.c'      => 'required|string|max:300',
            'options.d'      => 'required|string|max:300',
            'correct_answer' => 'required|in:a,b,c,d',
        ]);

        $question->update($data);

        return back()->with('success', 'تم تحديث السؤال بنجاح');
    }

    /**
     * DELETE /admin/video-questions/{question}
     */
    public function destroy(VideoQuestion $question)
    {
        $question->delete();
        return back()->with('success', 'تم حذف السؤال');
    }
}
