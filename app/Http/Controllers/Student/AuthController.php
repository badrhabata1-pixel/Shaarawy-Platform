<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the student login form.
     */
    public function showLogin()
    {
        // Already authenticated → redirect to dashboard
        if (Auth::guard('student')->check()) {
            return redirect()->route('student.dashboard');
        }

        return Inertia::render('Auth/StudentLogin', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle student login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('student')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة. ❌',
            ]);
        }

        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        // Block pending accounts
        if ($student->status === 'pending') {
            Auth::guard('student')->logout();
            throw ValidationException::withMessages([
                'email' => 'حسابك قيد المراجعة. سيتم التواصل معك قريباً. ✅',
            ]);
        }

        // Block inactive/suspended accounts
        if (!$student->is_active) {
            Auth::guard('student')->logout();
            throw ValidationException::withMessages([
                'email' => 'حسابك موقوف. يرجى التواصل مع الإدارة. 🔒',
            ]);
        }

        // Update last login timestamp
        $student->update(['last_login_at' => now()]);

        $request->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }

    /**
     * Logout student.
     */
    public function logout(Request $request)
    {
        Auth::guard('student')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('student.login')
            ->with('status', 'تم تسجيل الخروج بنجاح. 👋');
    }
}
