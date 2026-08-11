<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Units/Index', [
            'units'         => Unit::with('academicYear:id,name')->orderByDesc('id')->get(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Units/Form', [
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'price'            => ['nullable', 'numeric'],
            'description'      => ['nullable', 'string'],
            'term'             => ['nullable', 'in:first,second,summer'],
            'image'            => ['nullable', 'image', 'max:3072'],
        ]);

        $data['is_free']    = $request->boolean('is_free');
        $data['is_visible'] = $request->boolean('is_visible', true);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('units', 'public');
        }

        Unit::create($data);

        return redirect()->route('admin.units.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('Admin/Units/Form', [
            'item'          => $unit,
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $data = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'price'            => ['nullable', 'numeric'],
            'description'      => ['nullable', 'string'],
            'term'             => ['nullable', 'in:first,second,summer'],
            'image'            => ['nullable', 'image', 'max:3072'],
        ]);

        $data['is_free']    = $request->boolean('is_free');
        $data['is_visible'] = $request->boolean('is_visible', true);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('units', 'public');
        } else {
            unset($data['image']);
        }

        $unit->update($data);

        return redirect()->route('admin.units.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
