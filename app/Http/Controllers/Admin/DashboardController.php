<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Group;
use App\Models\Lesson;
use App\Models\PaymentRequest;
use App\Models\PaymentSetting;
use App\Models\Subscription;
use App\Models\TopStudent;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $arabicMonths = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس',    4 => 'أبريل',
            5 => 'مايو',  6 => 'يونيو',  7 => 'يوليو',    8 => 'أغسطس',
            9 => 'سبتمبر',10 => 'أكتوبر',11 => 'نوفمبر',  12 => 'ديسمبر',
        ];

        /* ── Stats ────────────────────────────────────── */
        $studentsTotal  = Student::count();
        $groupsTotal    = Group::count();
        $lessonsTotal   = Lesson::count();
        $revenue        = Subscription::where('status', 'active')->sum('price') ?? 0;
        $pendingSubs    = Subscription::where('status', 'pending')->count();
        $topStudents    = TopStudent::where('month', now()->format('Y-m'))->count();
        $onlineCount    = Student::where('student_type', 'online')->count();
        $offlineCount   = Student::where('student_type', 'offline')->count();
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

        /* ── Latest Students ──────────────────────────── */
        $latestStudents = Student::with(['academicYear:id,name', 'group:id,name'])
            ->latest()
            ->take(7)
            ->get(['id', 'name', 'academic_year_id', 'group_id', 'student_type', 'governorate', 'image', 'is_active', 'created_at'])
            ->map(fn ($s) => [
                'id'           => $s->id,
                'name'         => $s->name,
                'school_class' => $s->academicYear ? ['name' => $s->academicYear->name] : null,
                'group'        => $s->group        ? ['name' => $s->group->name]        : null,
                'student_type' => $s->student_type,
                'governorate'  => $s->governorate ?? '—',
                'is_active'    => (bool) $s->is_active,
                'created_at'   => $s->created_at?->format('Y/m/d'),
                'initials'     => mb_substr($s->name, 0, 1, 'UTF-8'),
                'image'        => $s->image,
            ]);

        /* ── Monthly Growth (last 6 months) ───────────── */
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyData[] = [
                'month'    => $arabicMonths[$date->month],
                'revenue'  => (int) Subscription::where('status', 'active')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('price'),
                'students' => Student::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'online'   => Student::where('student_type', 'online')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'offline'  => Student::where('student_type', 'offline')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'students'    => $studentsTotal,
                'groups'      => $groupsTotal,
                'lessons'     => $lessonsTotal,
                'revenue'     => (int) $revenue,
                'pendingSubs' => $pendingSubs,
                'topStudents' => $topStudents,
                'online'      => $onlineCount,
                'offline'     => $offlineCount,
            ],
            'latestStudents' => $latestStudents,
            'monthlyData'    => $monthlyData,
            'adminName'      => auth()->user()->name ?? 'الأستاذ محمد منصور',
            'receipts'       => $receipts,
            'paymentNumbers' => PaymentSetting::allAsArray(),
        ]);
    }
}
