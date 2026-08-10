<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
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

        $groupIds = $assistant->groups->pluck('id');

        // حساب الإحصائيات العامة السريعة
        $studentsCount = Student::whereIn('group_id', $groupIds)->count();

        $pendingExamsCount = StudentLessonProgress::where('quiz_passed', false)
            ->whereNotNull('quiz_score')
            ->whereIn('student_id', function ($query) use ($groupIds) {
                $query->select('id')->from('students')->whereIn('group_id', $groupIds);
            })->count();

        $pendingSheetsCount = StudentLessonProgress::where('is_completed', false)
            ->whereIn('student_id', function ($query) use ($groupIds) {
                $query->select('id')->from('students')->whereIn('group_id', $groupIds);
            })->count();

        // حساب عدد الطلاب الذين لم يشاهدوا الفيديوهات بشكل تقريبي للـ Badge
        $unwatchedCount = Student::whereIn('group_id', $groupIds)->count();

        // جلب تفاصيل المجموعات المسندة
        $myGroups = Group::where('assistant_id', $assistant->id)
            ->with('academicYear:id,name')
            ->withCount(['students' => fn($q) => $q->where('is_active', true)])
            ->get(['id', 'name', 'hour', 'academic_year_id'])
            ->map(fn($g) => [
                'id'            => $g->id,
                'name'          => $g->name,
                'hour'          => $g->hour,
                'year'          => $g->academicYear?->name,
                'students_count'=> $g->students_count,
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
                'my_students'    => $studentsCount,
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
        $groupIds = Group::where('assistant_id', $assistant->id)->pluck('id');
        
        $search = $request->input('search');

        // جلب طلاب مجموعات المساعد مع دعم الفلترة والبحث بالاسم أو الهاتف
        $myStudentsQuery = Student::whereIn('group_id', $groupIds)
            ->where('is_active', true)
            ->where('status', 'active');

        if (!empty($search)) {
            $myStudentsQuery->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        $myStudents = $myStudentsQuery->select('id', 'name', 'phone', 'parent_phone', 'group_id', 'image')->get();
        $myStudentIds = $myStudents->pluck('id');

        $availableLessonIds = Lesson::where('is_published', true)
            ->where('is_locked', false)
            ->pluck('id');

        $neverWatchedStudents = []; // 0% مشاهدة
        $partiallyWatchedStudents = []; // أقل من 90% مشاهدة

        if ($availableLessonIds->isNotEmpty() && $myStudentIds->isNotEmpty()) {
            $progressRecords = StudentLessonProgress::whereIn('student_id', $myStudentIds)
                ->whereIn('lesson_id', $availableLessonIds)
                ->get()
                ->groupBy('student_id');

            foreach ($myStudents as $student) {
                $group = Group::find($student->group_id);
                $studentData = [
                    'id'            => $student->id,
                    'name'          => $student->name,
                    'phone'         => $student->phone,
                    'parent_phone'  => $student->parent_phone,
                    'group_name'    => $group?->name ?? '—',
                    'watch_percent' => 0,
                    'image'         => $student->image,
                ];

                if (!isset($progressRecords[$student->id])) {
                    $neverWatchedStudents[] = $studentData;
                } else {
                    $latestProgress = $progressRecords[$student->id]->sortByDesc('last_watched_at')->first();
                    $watchPercent = $latestProgress->watch_percentage ?? 0;
                    $studentData['watch_percent'] = $watchPercent;

                    if ($watchPercent == 0) {
                        $neverWatchedStudents[] = $studentData;
                    } elseif ($watchPercent < 90) {
                        $partiallyWatchedStudents[] = $studentData;
                    }
                }
            }
        } else {
            foreach ($myStudents as $student) {
                $group = Group::find($student->group_id);
                $neverWatchedStudents[] = [
                    'id'            => $student->id,
                    'name'          => $student->name,
                    'phone'         => $student->phone,
                    'parent_phone'  => $student->parent_phone,
                    'group_name'    => $group?->name ?? '—',
                    'watch_percent' => 0,
                    'image'         => $student->image,
                ];
            }
        }

        // ترتيب الأقل مشاهدة أولاً لمتابعتهم
        usort($neverWatchedStudents, fn($a, $b) => $a['watch_percent'] <=> $b['watch_percent']);
        usort($partiallyWatchedStudents, fn($a, $b) => $a['watch_percent'] <=> $b['watch_percent']);

        return Inertia::render('Assistant/Students/WatchTracker', [
            'assistant'                  => $assistant,
            'never_watched_students'     => $neverWatchedStudents,
            'partially_watched_students' => $partiallyWatchedStudents,
            'filters'                    => ['search' => $search]
        ]);
    }
}
