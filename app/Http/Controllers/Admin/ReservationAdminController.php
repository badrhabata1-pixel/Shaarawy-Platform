<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => Reservation::with('group:id,name')->orderByDesc('id')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Reservations/Form', [
            'groups' => Group::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'address'      => ['nullable', 'string', 'max:255'],
            'school'       => ['nullable', 'string', 'max:255'],
            'parent_name'  => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:20'],
            'parent_job'   => ['nullable', 'string', 'max:255'],
            'code'         => ['nullable', 'string', 'max:100'],
            'group_id'     => ['nullable', 'exists:groups,id'],
            'study_type'   => ['nullable', 'in:online,offline'],
            'gender'       => ['nullable', 'in:male,female'],
            'is_paid'      => ['nullable', 'boolean'],
        ]);

        $data['is_paid'] = $data['is_paid'] ?? false;
        Reservation::create($data);

        return redirect()->route('admin.reservations.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Reservation $reservation)
    {
        return Inertia::render('Admin/Reservations/Form', [
            'item'   => $reservation,
            'groups' => Group::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['required', 'string', 'max:20'],
            'address'      => ['nullable', 'string', 'max:255'],
            'school'       => ['nullable', 'string', 'max:255'],
            'parent_name'  => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:20'],
            'parent_job'   => ['nullable', 'string', 'max:255'],
            'code'         => ['nullable', 'string', 'max:100'],
            'group_id'     => ['nullable', 'exists:groups,id'],
            'study_type'   => ['nullable', 'in:online,offline'],
            'gender'       => ['nullable', 'in:male,female'],
            'is_paid'      => ['nullable', 'boolean'],
        ]);

        $data['is_paid'] = $data['is_paid'] ?? false;
        $reservation->update($data);

        return redirect()->route('admin.reservations.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
