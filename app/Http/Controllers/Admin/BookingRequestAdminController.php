<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingRequest;
use Inertia\Inertia;

class BookingRequestAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/BookingRequests/Index', [
            'bookings' => BookingRequest::with('group:id,name')
                ->orderByRaw("status = 'pending' desc")
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function accept(BookingRequest $bookingRequest)
    {
        $bookingRequest->update(['status' => 'accepted']);

        return back()->with('success', 'تم قبول طلب الحجز ✓');
    }

    public function reject(BookingRequest $bookingRequest)
    {
        $bookingRequest->update(['status' => 'rejected']);

        return back()->with('success', 'تم رفض طلب الحجز');
    }

    public function destroy(BookingRequest $bookingRequest)
    {
        $bookingRequest->delete();

        return back()->with('success', 'تم حذف طلب الحجز');
    }
}
