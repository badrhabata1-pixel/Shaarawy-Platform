<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\BookingRequest;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingRequestController extends Controller
{
    /**
     * عرض صفحة حجز مقعد العامة — رابط مباشر بدون تسجيل دخول
     */
    public function create()
    {
        $academicYears = AcademicYear::orderBy('level')->get(['id', 'name', 'price']);
        $groups = Group::orderBy('name')->get(['id', 'name', 'academic_year_id']);

        return Inertia::render('BookingRequest/Create', [
            'academicYears' => $academicYears,
            'groups' => $groups,
        ]);
    }

    /**
     * استقبال بيانات حجز الطالب وحفظها بانتظار مراجعة الأستاذ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:150',
            'phone'        => 'required|string|max:20',
            'school'       => 'nullable|string|max:150',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'address'      => 'required|string|max:255',
            'parent_name'  => 'required|string|max:150',
            'parent_phone' => 'required|string|max:20',
            'parent_job'   => 'nullable|string|max:100',
            'group_id'     => 'nullable|exists:groups,id',
            'gender'       => 'nullable|in:male,female',
        ]);

        BookingRequest::create([
            ...$validated,
            'status' => 'pending',
        ]);

        return redirect()->route('booking-requests.create')
            ->with('success', 'تم إرسال طلب الحجز بنجاح! هيتم مراجعته والتواصل معاك قريباً.');
    }
}
