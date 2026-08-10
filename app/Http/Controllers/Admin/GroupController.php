<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\AdminModel;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Groups/Index', [
            'groups'        => Group::with('academicYear:id,name')->orderByDesc('id')->get(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'assistants'    => AdminModel::where('role', 'assistant')->orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Groups/Form', [
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'assistants'    => AdminModel::where('role', 'assistant')->orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'description'      => ['nullable', 'string'],
            'hour'             => ['nullable', 'string', 'max:255'],
            'assistant_id'     => ['nullable', 'exists:admins,id'],
            'start_date'       => ['nullable', 'date'],
            'end_date'         => ['nullable', 'date'],
            'attendance_type'  => ['nullable', 'in:online,offline,both'],
            'image'            => ['nullable', 'image', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('groups', 'public');
        }

        Group::create($data);

        return redirect()->route('admin.groups.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Group $group)
    {
        return Inertia::render('Admin/Groups/Form', [
            'item'          => $group,
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
            'assistants'    => AdminModel::where('role', 'assistant')->orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Group $group)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'description'      => ['nullable', 'string'],
            'hour'             => ['nullable', 'string', 'max:255'],
            'assistant_id'     => ['nullable', 'exists:admins,id'],
            'start_date'       => ['nullable', 'date'],
            'end_date'         => ['nullable', 'date'],
            'attendance_type'  => ['nullable', 'in:online,offline,both'],
            'image'            => ['nullable', 'image', 'max:3072'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('groups', 'public');
        } else {
            unset($data['image']);
        }

        $group->update($data);

        return redirect()->route('admin.groups.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Group $group)
    {
        $group->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
