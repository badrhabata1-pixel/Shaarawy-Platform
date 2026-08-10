<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureStudentIsActive
{
    public function handle(Request $request, Closure $next)
    {
        /** @var \App\Models\Student|null $student */
        $student = Auth::guard('student')->user();

        if (!$student) {
            return redirect()->route('student.login');
        }

        if ($student->status === 'pending') {
            Auth::guard('student')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('student.login')
                ->withErrors(['email' => 'حسابك قيد المراجعة. سيتم تفعيله قريباً من قِبَل الإدارة. ✅']);
        }

        if (!$student->is_active) {
            Auth::guard('student')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('student.login')
                ->withErrors(['email' => 'حسابك موقوف. يرجى التواصل مع الإدارة. 🔒']);
        }

        return $next($request);
    }
}
