<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssistantController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assistants/Index', [
            'assistants' => AdminModel::where('role', 'assistant')->orderByDesc('id')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Assistants/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:admins,email'],
            'phone'    => ['nullable', 'string', 'max:50'],
            'salary'   => ['nullable', 'numeric'],
            'role'     => ['in:assistant,teacher'],
            'image'    => ['nullable', 'image', 'max:3072'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('assistants', 'public');
        }

        $data['password'] = bcrypt($data['password']);

        AdminModel::create($data);

        return redirect()->route('admin.assistants.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(AdminModel $assistant)
    {
        return Inertia::render('Admin/Assistants/Form', [
            'item' => $assistant,
        ]);
    }

    public function update(Request $request, AdminModel $assistant)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:admins,email,' . $assistant->id],
            'phone'    => ['nullable', 'string', 'max:50'],
            'salary'   => ['nullable', 'numeric'],
            'role'     => ['in:assistant,teacher'],
            'image'    => ['nullable', 'image', 'max:3072'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('assistants', 'public');
        } else {
            unset($data['image']);
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $assistant->update($data);

        return redirect()->route('admin.assistants.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(AdminModel $assistant)
    {
        $assistant->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
