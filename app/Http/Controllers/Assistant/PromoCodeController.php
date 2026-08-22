<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Lesson;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PromoCodeController extends Controller
{
    /**
     * Show the promo codes hub.
     */
    public function index()
    {
        /** @var \App\Models\AdminModel $assistant */
        $assistant = Auth::guard('assistant')->user();

        $promoCodes = PromoCode::with([
                'academicYear:id,name',
                'lesson:id,title',
                'usedBy:id,name',
            ])
            ->orderByDesc('id')
            ->paginate(50);

        $academicYears = AcademicYear::orderByDesc('id')->get(['id', 'name']);
        $lessons       = Lesson::where('is_published', true)
            ->orderBy('lesson_number')
            ->get(['id', 'title', 'unit_id']);

        return Inertia::render('Assistant/PromoCodes', [
            'assistant'    => $assistant,
            'promoCodes'   => $promoCodes,
            'academicYears'=> $academicYears,
            'lessons'      => $lessons,
        ]);
    }

    /**
     * Generate alphanumeric promo codes for a given academic year / lesson.
     * Format: SWEFY-XXXXX (e.g. SWEFY-A3K7P)
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'lesson_id'        => ['nullable', 'exists:lessons,id'],
            'count'            => ['required', 'integer', 'min:1', 'max:200'],
        ]);

        $created = 0;
        $attempts = 0;
        $maxAttempts = $validated['count'] * 3;

        while ($created < $validated['count'] && $attempts < $maxAttempts) {
            $attempts++;
            // MANSOUR-XXXXX format (alphanumeric, uppercase)
            $code = 'MANSOUR-' . strtoupper(Str::random(5));

            if (!PromoCode::where('code', $code)->exists()) {
                PromoCode::create([
                    'code'             => $code,
                    'academic_year_id' => $validated['academic_year_id'],
                    'lesson_id'        => $validated['lesson_id'] ?? null,
                ]);
                $created++;
            }
        }

        return back()->with('success', "تم توليد {$created} كود تفعيل بنجاح ✅");
    }

    /**
     * Delete a promo code.
     */
    public function destroy($id)
    {
        $code = PromoCode::findOrFail($id);

        if ($code->is_used) {
            return back()->with('error', 'لا يمكن حذف كود مستخدم بالفعل ❌');
        }

        $code->delete();

        return back()->with('success', 'تم حذف الكود بنجاح ✓');
    }

    /**
     * Delete ALL promo codes at once.
     */
    public function destroyAll()
    {
        $count = PromoCode::count();
        PromoCode::query()->delete();

        return back()->with('success', "تم حذف {$count} كود بنجاح ✓");
    }
}
