<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Group;
use App\Models\Student;
use App\Models\SheetAnswer;
use App\Models\ExamResult;
use App\Models\Lesson;
use App\Models\PaymentRequest;
use App\Models\StudentLessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * عرض لوحة التحكم الرئيسية الخاصة بالمساعدين
     */
    public function index()
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user()->load('groups');

        // الإحصائيات على مستوى المنصة كلها (نفس نطاق قائمة الطلاب وصفحات التصحيح عند السكرتارية)
        $activeStudentsCount = Student::where('is_active', true)->where('status', 'active')->count();
        $pendingExamsCount   = ExamResult::where('status', 'pending')->count();
        $pendingSheetsCount  = SheetAnswer::where('status', 'pending')->count();
        [$never, $partial]   = $this->watchBuckets();
        $unwatchedCount      = count($never) + count($partial);

        // عدد الطلاب المسجلين في كل صف دراسي
        $myGroups = AcademicYear::withCount('students')
            ->orderBy('level')
            ->get(['id', 'name'])
            ->map(fn ($year) => [
                'id'             => $year->id,
                'name'           => $year->name,
                'students_count' => $year->students_count,
            ]);

        $receipts = collect();
        if (Schema::hasTable('payment_requests')) {
            $receipts = PaymentRequest::with(['student:id,name,phone,email,image', 'unit:id,title'])
                ->where('status', 'approved')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($r) => [
                    'id'             => $r->id,
                    'image_url'      => asset('storage/' . $r->screenshot),
                    'status'         => $r->status,
                    'payment_method' => $r->method,
                    'unit_title'     => $r->unit?->title,
                    'amount'         => $r->amount,
                    'submitted_at'   => $r->created_at?->format('Y-m-d H:i'),
                    'student'        => [
                        'id'    => $r->student?->id,
                        'name'  => $r->student?->name,
                        'phone' => $r->student?->phone,
                    ],
                ]);
        }

        return Inertia::render('Assistant/Dashboard', [
            'assistant' => $assistant,
            'stats'     => [
                'my_students'    => $activeStudentsCount,
                'pending_exams'  => $pendingExamsCount,
                'pending_sheets' => $pendingSheetsCount,
                'unwatched_count'=> $unwatchedCount,
            ],
            'my_groups' => $myGroups,
            'receipts'  => $receipts,
        ]);
    }

    /**
     * صفحة تتبع مشاهدات ومتابعة كسل الطلاب المستقلة والمفصلة ببحث سريع (الميزة الجديدة)
     */
    public function watchTracker(Request $request)
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();
        $search    = $request->input('search');

        [$never, $partial] = $this->watchBuckets($search);

        return Inertia::render('Assistant/Students/WatchTracker', [
            'assistant'                  => $assistant,
            'never_watched_students'     => $never,
            'partially_watched_students' => $partial,
            'filters'                    => ['search' => $search],
        ]);
    }

    /**
     * الطلاب المفعّلون المتأخرون في الفيديوهات: [لم يشاهدوا إطلاقًا، شاهدوا أقل من 90%].
     * نفس المنطق يستخدمه كارت لوحة التحكم وصفحة المتابعة عشان الرقم يطابق القائمة.
     */
    private function watchBuckets(?string $search = null): array
    {
        $query = Student::with('group:id,name')
            ->where('is_active', true)
            ->where('status', 'active');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        $students  = $query->select('id', 'name', 'phone', 'parent_phone', 'group_id', 'image')->get();
        $lessonIds = Lesson::where('is_published', true)->where('is_locked', false)->pluck('id');
        $progress  = ($lessonIds->isNotEmpty() && $students->isNotEmpty())
            ? StudentLessonProgress::whereIn('student_id', $students->pluck('id'))
                ->whereIn('lesson_id', $lessonIds)->get()->groupBy('student_id')
            : collect();

        $never = [];
        $partial = [];

        foreach ($students as $student) {
            $row = [
                'id'            => $student->id,
                'name'          => $student->name,
                'phone'         => $student->phone,
                'parent_phone'  => $student->parent_phone,
                'group_name'    => $student->group?->name ?? '—',
                'watch_percent' => 0,
                'image'         => $student->image,
            ];

            if (!isset($progress[$student->id])) {
                $never[] = $row;
                continue;
            }

            $percent = $progress[$student->id]->sortByDesc('last_watched_at')->first()->watch_percentage ?? 0;
            $row['watch_percent'] = $percent;

            if ($percent == 0) {
                $never[] = $row;
            } elseif ($percent < 90) {
                $partial[] = $row;
            }
        }

        usort($never, fn ($a, $b) => $a['watch_percent'] <=> $b['watch_percent']);
        usort($partial, fn ($a, $b) => $a['watch_percent'] <=> $b['watch_percent']);

        return [$never, $partial];
    }
}
