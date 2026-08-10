<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ShareStudentData
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('student')->check()) {
            $student = Auth::guard('student')->user();

            Inertia::share('student', [
                'id'        => $student->id,
                'full_name' => $student->full_name,
                'initials'  => $student->initials,
                'email'     => $student->email,
                'avatar'    => $student->avatar 
                    ? asset('uploads/students/' . $student->avatar) 
                    : null,
                'mode'      => $student->mode,
            ]);

            // جلب الإشعارات التفاعلية لصف الطالب أو العامة لمنع أي أخطاء SQL إذا لم تُنشأ الجداول بعد
            $dbNotifications = [];
            if (Schema::hasTable('notifications')) {
                $dbNotifications = \App\Models\Notification::where(function ($q) use ($student) {
                        // إشعارات عامة أو لصف الطالب — بشرط أنها مش موجهة لطالب بعينه
                        $q->whereNull('student_id')
                          ->where(function ($q2) use ($student) {
                              $q2->whereNull('academic_year_id')
                                 ->orWhere('academic_year_id', $student->academic_year_id);
                          });
                    })
                    ->orWhere('student_id', $student->id) // أو موجهة لهذا الطالب تحديداً
                    ->orderByDesc('id')
                    ->take(6)
                    ->get()
                    ->map(fn($n) => [
                        'id'   => $n->id,
                        'text' => $n->text,
                        'date' => $n->created_at->diffForHumans()
                    ]);
            }

            Inertia::share('notifications', $dbNotifications);
        }

        return $next($request);
    }
}