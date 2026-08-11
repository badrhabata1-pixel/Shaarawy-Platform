<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\PaymentReceipt;
use App\Models\PaymentSetting;
use App\Models\Sheet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user()->load('academicYear');

        // جلب المحاضرات المنشورة للصف الدراسي للطالب عبر علاقة الـ Units المعتمدة
        $lessons = Lesson::whereHas('unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->where('is_published', true)
            ->orderBy('lesson_number')
            ->get(['id', 'title', 'duration_minutes', 'lesson_number', 'is_locked', 'image']);

        $totalLessons = $lessons->count();

        // خريطة تقدم الطالب
        $progressMap = $student->progress()
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        $completedCount = $progressMap->where('is_completed', true)->count();
        $unlockedCount  = $progressMap->where('is_unlocked', true)->count();
        $quizScores     = $progressMap->whereNotNull('quiz_score')->pluck('quiz_score');
        
        // احتساب متوسط الدرجات مباشرة لضمان أداء مستقر 100%
        $quizAverage = $quizScores->count() > 0 ? round($quizScores->avg(), 1) : 0;

        // تجهيز بيانات الدروس
        $lessonsProgress = $lessons->map(function ($lesson) use ($progressMap) {
            $p = $progressMap->get($lesson->id);
            return [
                'id'           => $lesson->id,
                'title'        => $lesson->title,
                'duration'     => $lesson->duration_minutes,
                'is_locked'    => $lesson->is_locked,
                'is_unlocked'  => $p?->is_unlocked ?? false,
                'is_completed' => $p?->is_completed ?? false,
                'quiz_score'   => $p?->quiz_score,
                'quiz_passed'  => $p?->quiz_passed ?? false,
            ];
        });

        // Upcoming / active exams (next 3)
        $now            = now();
        $upcomingExams  = Exam::where('class_id', $student->academic_year_id)
            ->where(fn ($q) => $q
                ->whereNull('end_time')
                ->orWhere('end_time', '>=', $now)
            )
            ->orderBy('start_time')
            ->limit(3)
            ->get(['id', 'title', 'start_time', 'end_time', 'time_limit_minutes', 'total_marks'])
            ->map(function (Exam $exam) use ($now) {
                if ($exam->start_time && $now->lt($exam->start_time)) {
                    $status = 'upcoming';
                } elseif ($exam->end_time && $now->gt($exam->end_time)) {
                    $status = 'ended';
                } else {
                    $status = 'active';
                }
                return [
                    'id'         => $exam->id,
                    'title'      => $exam->title,
                    'start_time' => $exam->start_time?->format('Y-m-d H:i'),
                    'end_time'   => $exam->end_time?->format('Y-m-d H:i'),
                    'time_limit' => $exam->time_limit_minutes,
                    'marks'      => $exam->total_marks,
                    'status'     => $status,
                ];
            });

        // Recent sheets for this student's academic year
        $recentSheets = Sheet::whereHas('lesson.unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->with([
                'lesson:id,title',
                'answers' => fn ($q) =>
                    $q->where('student_id', $student->id)->select('id', 'sheet_id', 'total_score', 'status'),
            ])
            ->orderByDesc('id')
            ->limit(4)
            ->get()
            ->map(fn (Sheet $sheet) => [
                'id'          => $sheet->id,
                'title'       => $sheet->title,
                'total_marks' => $sheet->total_marks,
                'lesson_title'=> $sheet->lesson?->title,
                'answer'      => $sheet->answers->first()
                    ? [
                        'score'  => $sheet->answers->first()->total_score,
                        'status' => $sheet->answers->first()->status,
                    ]
                    : null,
            ]);
        $paymentSettings = PaymentSetting::allAsArray();
        $latestReceipt = Schema::hasTable('payment_receipts')
            ? PaymentReceipt::where('student_id', $student->id)->latest()->first()
            : null;

        return Inertia::render('Student/Dashboard', [
            'student' => [
                'id'           => $student->id,
                'full_name'    => $student->full_name,
                'initials'     => $student->initials,
                'email'        => $student->email,
                'phone'        => $student->phone,
                'mode'         => $student->student_type, // استخدام حقل student_type المعتمد
                'grade'        => $student->academicYear?->name ?? 'غير محدد',
                'grade_level'  => $student->academicYear?->level ?? 0,
                'last_login'   => $student->last_login_at?->diffForHumans(),
                'badge'        => $student->level_badge, // تمرير اللقب الديناميكي المحدث
            ],
            'stats' => [
                'total_lessons'  => $totalLessons,
                'completed'      => $completedCount,
                'unlocked'       => $unlockedCount,
                'quiz_average'   => $quizAverage,
                'completion_pct' => $totalLessons > 0
                    ? round(($completedCount / $totalLessons) * 100)
                    : 0,
            ],
            'lessons_progress' => $lessonsProgress,
            'upcoming_exams'   => $upcomingExams,
            'recent_sheets'    => $recentSheets,
            'subscription'     => [
                'vodafone_number' => $paymentSettings['vodafone_number'] ?? '',
                'vodafone_name'   => $paymentSettings['vodafone_name'] ?? '',
                'instapay_number' => $paymentSettings['instapay_number'] ?? '',
                'instapay_name'   => $paymentSettings['instapay_name'] ?? '',
            ],
            'payment'          => $latestReceipt ? ['status' => $latestReceipt->status] : null,
        ]);
    }
}
