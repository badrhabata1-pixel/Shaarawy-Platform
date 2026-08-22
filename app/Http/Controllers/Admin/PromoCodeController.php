<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoCodeController extends Controller
{
    /**
     * Bulk-generate numeric voucher codes for a given academic year.
     * POST /admin/promo-codes/generate
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'count'            => ['required', 'integer', 'min:1', 'max:500'],
            'lesson_id'        => ['nullable', 'exists:lessons,id'],
        ]);

        $created = PromoCode::bulkGenerate(
            academicYearId: $validated['academic_year_id'],
            count:          $validated['count'],
            lessonId:       $validated['lesson_id'] ?? null,
        );

        return back()->with('success', "تم توليد {$created} كود بنجاح ✅");
    }

    /**
     * List promo codes (for admin panel) — JSON API.
     * GET /admin/promo-codes
     */
    public function index(Request $request)
    {
        $codes = PromoCode::with(['academicYear:id,name', 'usedBy:id,name'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($codes);
    }

    /**
     * Inertia web view for promo codes.
     * GET /admin/promo-codes/web
     */
    public function webIndex()
    {
        return Inertia::render('Admin/PromoCodes/Index', [
            'promoCodes'    => PromoCode::with(['academicYear:id,name', 'usedBy:id,name'])
                ->orderByDesc('id')
                ->get(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    /**
     * Delete a promo code.
     * DELETE /admin/promo-codes/{id}
     */
    public function destroy($id)
    {
        PromoCode::findOrFail($id)->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }

    /**
     * Delete ALL promo codes at once.
     * DELETE /admin/promo-codes/all
     */
    public function destroyAll()
    {
        $count = PromoCode::count();
        PromoCode::query()->delete();

        return back()->with('success', "تم حذف {$count} كود بنجاح ✓");
    }
}
