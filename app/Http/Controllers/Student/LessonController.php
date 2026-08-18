<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Lesson;
use App\Models\PaymentRequest;
use App\Models\PromoCode;
use App\Models\Subscription;
use App\Models\StudentLessonProgress;
use App\Models\Unit;
use App\Models\VideoQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LessonController extends Controller
{
    /**
     * قائمة الوحدات الدراسية المتاحة للطالب — أول شاشة يختار منها الوحدة
     */
    public function index()
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user()->load('academicYear');

        $units = Unit::where('academic_year_id', $student->academic_year_id)
            ->where('is_visible', true)
            ->withCount(['lessons' => fn ($q) => $q->where('is_published', true)])
            ->orderBy('id')
            ->get(['id', 'title', 'description', 'image', 'price', 'term', 'is_free', 'academic_year_id']);

        $unitIds = $units->pluck('id');

        $subscribedUnitIds = Subscription::where('student_id', $student->id)
            ->where('is_active', true)
            ->whereIn('unit_id', $unitIds)
            ->pluck('unit_id')
            ->flip();

        $paymentMap = PaymentRequest::where('student_id', $student->id)
            ->whereIn('unit_id', $unitIds)
            ->orderByDesc('id')
            ->get()
            ->groupBy('unit_id')
            ->map(fn ($records) => $records->first()->status);

        $completedCounts = StudentLessonProgress::where('student_id', $student->id)
            ->where('is_completed', true)
            ->whereHas('lesson', fn ($q) => $q->whereIn('unit_id', $unitIds))
            ->with('lesson:id,unit_id')
            ->get()
            ->groupBy(fn ($p) => $p->lesson->unit_id)
            ->map->count();

        $unitsData = $units->map(function (Unit $unit) use ($subscribedUnitIds, $paymentMap, $completedCounts) {
            return [
                'id'              => $unit->id,
                'title'           => $unit->title,
                'description'     => $unit->description,
                'image'           => $unit->image,
                'price'           => $unit->price,
                'term'            => $unit->term,
                'is_free'         => $unit->is_free,
                'lessons_count'   => $unit->lessons_count,
                'completed_count' => $completedCounts->get($unit->id, 0),
                'is_unlocked'     => $unit->is_free || isset($subscribedUnitIds[$unit->id]),
                'payment_status'  => $paymentMap->get($unit->id),
            ];
        });

        return Inertia::render('Student/Units', [
            'student' => [
                'full_name' => $student->full_name,
                'grade'     => $student->academicYear?->name ?? 'غير محدد',
            ],
            'units' => $unitsData,
        ]);
    }

    /**
     * جدار محاضرات وحدة واحدة بعينها
     */
    public function unitLessons(int $unitId)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user()->load('academicYear');

        $unit = Unit::where('id', $unitId)
            ->where('academic_year_id', $student->academic_year_id)
            ->firstOrFail();

        $lessons = Lesson::where('unit_id', $unit->id)
            ->where('is_published', true)
            ->with('unit:id,title')
            ->orderBy('lesson_number')
            ->get(['id','title','description','image','duration_minutes','lesson_number',
                   'unit_id','is_locked','is_published','gate_exam_id']);

        $progressMap = $student->progress()
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        // Map unit_id → latest payment status for this student
        $unitIds = $lessons->pluck('unit_id')->unique();
        $paymentMap = PaymentRequest::where('student_id', $student->id)
            ->whereIn('unit_id', $unitIds)
            ->orderByDesc('id')
            ->get()
            ->groupBy('unit_id')
            ->map(fn($records) => $records->first()->status); // latest status per unit

        // Units the student has an approved subscription for (payment approved → auto-unlock)
        $subscribedUnitIds = \App\Models\Subscription::where('student_id', $student->id)
            ->where('is_active', true)
            ->whereIn('unit_id', $unitIds)
            ->pluck('unit_id')
            ->flip(); // use as O(1) lookup set

        // ── Exam gate: determine which gate exams this student has passed ──────────
        $gateExamIds = $lessons->pluck('gate_exam_id')->filter()->unique();
        $gateExams   = collect();
        $passedExamIds = collect();

        if ($gateExamIds->isNotEmpty()) {
            $gateExams = Exam::whereIn('id', $gateExamIds)
                ->get(['id', 'title', 'total_marks'])
                ->keyBy('id');

            // Best score per exam for this student
            $bestScores = ExamResult::where('student_id', $student->id)
                ->whereIn('exam_id', $gateExamIds)
                ->whereNotNull('score')
                ->get(['exam_id', 'score'])
                ->groupBy('exam_id')
                ->map(fn($rows) => $rows->max('score'));

            // Exam is "passed" when best score >= 50% of total_marks
            $passedExamIds = $gateExamIds->filter(function ($examId) use ($gateExams, $bestScores) {
                $exam = $gateExams->get($examId);
                return $exam && ($bestScores->get($examId) ?? -1) >= ($exam->total_marks * 0.5);
            })->flip();
        }

        // Group lessons by unit for sequential gate checking
        $lessonsByUnit = $lessons->groupBy('unit_id');

        $lessonsData = $lessons->map(function (Lesson $lesson) use ($progressMap, $paymentMap, $subscribedUnitIds, $lessonsByUnit, $gateExams, $passedExamIds) {
            $p = $progressMap->get($lesson->id);
            $paidUnlock = isset($subscribedUnitIds[$lesson->unit_id]);

            // Exam gate: blocked if any earlier lesson in unit has an unpassed gate exam
            $examLocked       = false;
            $blockingExamId   = null;
            $blockingExamTitle = null;

            foreach ($lessonsByUnit->get($lesson->unit_id, collect()) as $prev) {
                if ($prev->lesson_number < $lesson->lesson_number
                    && $prev->gate_exam_id
                    && !isset($passedExamIds[$prev->gate_exam_id])) {
                    $examLocked        = true;
                    $blockingExamId    = $prev->gate_exam_id;
                    $blockingExamTitle = $gateExams->get($prev->gate_exam_id)?->title;
                    break;
                }
            }

            return [
                'id'              => $lesson->id,
                'title'           => $lesson->title,
                'description'     => $lesson->description,
                'thumbnail_url'   => $this->publicFileUrl($lesson->image),
                'duration'        => $lesson->duration_minutes,
                'duration_fmt'    => $lesson->duration_formatted,
                'order'           => $lesson->lesson_number,
                'unit_id'         => $lesson->unit_id,
                'is_locked'       => $lesson->is_locked,
                'is_unlocked'     => $paidUnlock || ($p?->is_unlocked ?? false),
                'is_completed'    => $p?->is_completed ?? false,
                'quiz_passed'     => $p?->quiz_passed ?? false,
                'quiz_score'      => $p?->quiz_score,
                'payment_status'  => $paymentMap->get($lesson->unit_id),
                'exam_locked'     => $examLocked,
                'gate_exam_id'    => $blockingExamId,
                'gate_exam_title' => $blockingExamTitle,
            ];
        });

        return Inertia::render('Student/Lessons', [
            'student' => [
                'full_name'   => $student->full_name,
                'grade'       => $student->academicYear?->name ?? 'غير محدد',
                'grade_level' => $student->academicYear?->level ?? 0,
                'mode'        => $student->student_type,
            ],
            'unit' => [
                'id'    => $unit->id,
                'title' => $unit->title,
            ],
            'lessons' => $lessonsData,
        ]);
    }

    /**
     * صفحة الامتحانات المستقلة والتقييمات المخصصة للطلاب
     */
    public function examsIndex()
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user()->load('academicYear');

        $lessons = Lesson::whereHas('unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->where('is_published', true)
            ->orderBy('lesson_number')
            ->get();

        $progress = $student->progress()
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->whereNotNull('quiz_score')
            ->get()
            ->map(function ($p) use ($lessons) {
                $lesson = $lessons->where('id', $p->lesson_id)->first();
                return [
                    'id' => $p->id,
                    'lesson_title' => $lesson?->title ?? 'اختبار غير معروف',
                    'score' => $p->quiz_score,
                    'passed' => $p->quiz_passed,
                    'completed_at' => $p->updated_at->diffForHumans(),
                ];
            });

        return Inertia::render('Student/Exams', [
            'student' => [
                'full_name' => $student->full_name,
                'badge'     => $student->level_badge, // حساب اللقب والمستوى الدراسي تلقائياً
            ],
            'exams' => $progress,
        ]);
    }

    /**
     * مشغل الفيديو الفردي المحمي بالعلامة المائية
     */
    public function show(int $id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $lesson = Lesson::where('id', $id)
            ->whereHas('unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->where('is_published', true)
            ->with('gateExam:id,title,total_marks')
            ->firstOrFail();

        $progress = StudentLessonProgress::firstOrCreate(
            ['student_id' => $student->id, 'lesson_id' => $lesson->id]
        );

        // Check subscription-based unlock before blocking
        $isSubscribed = \App\Models\Subscription::where('student_id', $student->id)
            ->where('unit_id', $lesson->unit_id)
            ->where('is_active', true)
            ->exists();

        if ($lesson->is_locked && !$progress->is_unlocked && !$isSubscribed) {
            return redirect()->route('student.lessons.unit', $lesson->unit_id)
                ->withErrors(['access' => 'هذا الدرس مقفل. قم بفتحه أولاً. 🔒']);
        }

        // Exam gate: check all previous lessons in this unit for unpassed gate exams
        $prevGated = Lesson::where('unit_id', $lesson->unit_id)
            ->where('lesson_number', '<', $lesson->lesson_number)
            ->whereNotNull('gate_exam_id')
            ->with('gateExam:id,title,total_marks')
            ->orderBy('lesson_number')
            ->get();

        foreach ($prevGated as $prev) {
            $exam = $prev->gateExam;
            if (!$exam) continue;
            $threshold = $exam->total_marks * 0.5;
            $passed = ExamResult::where('student_id', $student->id)
                ->where('exam_id', $exam->id)
                ->whereNotNull('score')
                ->where('score', '>=', $threshold)
                ->exists();
            if (!$passed) {
                return redirect()->route('student.lessons.unit', $lesson->unit_id)
                    ->withErrors(['access' => 'لازم تعدي امتحان "' . $exam->title . '" بنسبة 50% الأول ✏️']);
            }
        }

        // Build ordered video list: main video (index 0) + any extra videos
        // extra_video_urls stored as [{url, label}] objects or plain strings
        $videos = [];
        if ($lesson->video_url) {
            $videos[] = ['index' => 0, 'label' => 'الفيديو الرئيسي', 'url' => $lesson->video_url];
        }
        foreach ($lesson->extra_video_urls ?? [] as $i => $v) {
            $url   = is_array($v) ? ($v['url']   ?? '') : (string) $v;
            $label = is_array($v) ? ($v['label']  ?? 'فيديو ' . ($i + 2)) : 'فيديو ' . ($i + 2);
            if ($url) {
                $videos[] = ['index' => $i + 1, 'label' => $label, 'url' => $url];
            }
        }

        // Focus questions grouped by video_index (shown during playback)
        $focusQsByVideo = VideoQuestion::where('lesson_id', $lesson->id)
            ->orderBy('video_index')
            ->orderBy('position')
            ->get(['id', 'question_text', 'options', 'position', 'video_index'])
            ->groupBy('video_index')
            ->map(fn ($g) => $g->values())
            ->toArray();

        // Build public URLs for PDF files (supports both old storage/ and new uploads/ paths)
        $pdfUrl = fn($path) => $path
            ? (str_starts_with($path, 'uploads/') ? asset($path) : asset('storage/' . $path))
            : null;
        $pdfs = array_values(array_filter([
            $lesson->pdf_file   ? ['label' => 'الشيت الرئيسي',  'url' => $pdfUrl($lesson->pdf_file)]   : null,
            $lesson->pdf_file_2 ? ['label' => 'الشيت الثاني',   'url' => $pdfUrl($lesson->pdf_file_2)] : null,
            ...array_map(fn($p, $i) => $p ? ['label' => 'ملف إضافي ' . ($i + 1), 'url' => $pdfUrl($p)] : null,
                $lesson->extra_pdfs ?? [], array_keys($lesson->extra_pdfs ?? [])),
        ]));

        // ── دعم المادة الفني: أسئلة هذا الطالب على هذا الدرس مع ردود الأستاذ ──
        $comments = Comment::where('lesson_id', $lesson->id)
            ->where('student_id', $student->id)
            ->orderBy('created_at')
            ->get()
            ->map(fn (Comment $c) => [
                'id'              => $c->id,
                'body'            => $c->body,
                'image_url'       => $c->image_url,
                'voice_url'       => $c->voice_url,
                'reply_body'      => $c->reply_body,
                'reply_image_url' => $c->reply_image_url,
                'reply_voice_url' => $c->reply_voice_url,
                'replied_at'      => $c->replied_at?->diffForHumans(),
                'created_at'      => $c->created_at->diffForHumans(),
            ]);

        return Inertia::render('Student/LessonShow', [
            'lesson' => [
                'id'            => $lesson->id,
                'title'         => $lesson->title,
                'description'   => $lesson->description,
                'stream_url'    => $lesson->video_url,
                'duration'      => $lesson->duration_minutes,
                'order'         => $lesson->lesson_number,
                'unit_id'       => $lesson->unit_id,
                'passing_score' => $lesson->passing_score,
                'gate_exam'     => $this->buildGateExamData($lesson, $student->id),
            ],
            'pdfs' => $pdfs,
            'videos'                  => $videos,
            'focus_questions_by_video' => $focusQsByVideo,
            'comments' => $comments,
            'progress' => [
                'is_completed' => $progress->is_completed,
                'quiz_score'   => $progress->quiz_score,
                'quiz_passed'  => $progress->quiz_passed,
            ],
            'watermark' => [
                'email' => $student->email,
                'phone' => $student->phone ?? '—',
                'ip'    => request()->ip(),
                'name'  => $student->full_name,
            ],
        ]);
    }

    /**
     * تفعيل وفتح الدرس بكود التفعيل
     */
    public function unlock(Request $request, int $id)
    {
        $request->validate([
            'code' => ['required', 'string', 'min:6', 'max:14'],
        ]);

        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $lesson = Lesson::where('id', $id)
            ->whereHas('unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->firstOrFail();

        $success = PromoCode::redeem($request->input('code'), $student);

        if (!$success) {
            return back()->withErrors(['code' => 'الكود غير صحيح أو تم استخدامه مسبقاً. ❌']);
        }

        return back()->with('success', 'تم فتح الدرس بنجاح! 🎉');
    }

    /**
     * تسليم إجابات الاختبار الدوري وحفظ النتيجة
     */
    public function submitQuiz(Request $request, int $id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'answers' => 'required|array',
        ]);

        $questions = VideoQuestion::where('lesson_id', $lesson->id)->get()->keyBy('id');
        $answers   = $request->input('answers');

        $correct = 0;
        foreach ($answers as $qId => $answer) {
            if (isset($questions[$qId]) && $questions[$qId]->correct_answer === $answer) {
                $correct++;
            }
        }

        $total       = $questions->count();
        $score       = $total > 0 ? round(($correct / $total) * 100) : 0;
        $passingScore = $lesson->passing_score ?? 60;
        $passed      = $score >= $passingScore;

        $progress = StudentLessonProgress::firstOrCreate([
            'student_id' => $student->id,
            'lesson_id'  => $lesson->id,
        ]);

        if (!$progress->quiz_passed) {
            $progress->update([
                'quiz_score'   => $score,
                'quiz_passed'  => $passed,
                'is_completed' => $passed,
                'completed_at' => $passed ? now() : null,
            ]);
        }

        return response()->json([
            'score'   => $score,
            'passed'  => $passed,
            'correct' => $correct,
            'total'   => $total,
        ]);
    }

    private function buildGateExamData(Lesson $lesson, int $studentId): ?array
    {
        if (!$lesson->gate_exam_id || !$lesson->gateExam) {
            return null;
        }

        $gateExam  = $lesson->gateExam;
        $threshold = $gateExam->total_marks * 0.5;

        $bestResult = ExamResult::where('student_id', $studentId)
            ->where('exam_id', $gateExam->id)
            ->whereNotNull('score')
            ->orderByDesc('score')
            ->first();

        $passed = $bestResult && $bestResult->score >= $threshold;

        return [
            'id'     => $gateExam->id,
            'title'  => $gateExam->title,
            'total'  => $gateExam->total_marks,
            'passed' => $passed,
            'score'  => $bestResult?->score,
        ];
    }

    private function publicFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return str_starts_with($path, 'uploads/')
            ? asset($path)
            : asset('storage/' . ltrim($path, '/'));
    }
}
