<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\AdminModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the assistant login form (مصحح ليتطابق مع مجلد auth الفعلي).
     */
    public function showLogin()
    {
        if (Auth::guard('assistant')->check()) {
            return redirect()->route('assistant.dashboard');
        }

        // تم تصحيح المسار ليكون متطابقاً تماماً مع بنية مشروعك
        return Inertia::render('Assistant/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle assistant login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('assistant')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة. ❌',
            ]);
        }

        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        // التأكد إن الـ role صح
        if (!in_array($assistant->role, ['assistant', 'admin'])) {
            Auth::guard('assistant')->logout();
            throw ValidationException::withMessages([
                'email' => 'ليس لديك صلاحية الدخول. 🔒',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('assistant.dashboard'));
    }

    /**
     * Logout assistant.
     */
    public function logout(Request $request)
    {
        Auth::guard('assistant')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('assistant.login')
            ->with('status', 'تم تسجيل الخروج بنجاح. 👋');
    }
}
