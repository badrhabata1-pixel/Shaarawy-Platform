<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Classes/Index', [
            'classes' => AcademicYear::orderByDesc('id')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Classes/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'max:3072'],
            'level'       => ['nullable', 'integer', 'min:0', 'max:255'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('classes', 'public');
        }

        AcademicYear::create($data);

        return redirect()->route('admin.classes.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(AcademicYear $class)
    {
        return Inertia::render('Admin/Classes/Form', [
            'item' => $class,
        ]);
    }

    public function update(Request $request, AcademicYear $class)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'max:3072'],
            'level'       => ['nullable', 'integer', 'min:0', 'max:255'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('classes', 'public');
        } else {
            unset($data['image']);
        }

        $class->update($data);

        return redirect()->route('admin.classes.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(AcademicYear $class)
    {
        $class->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
