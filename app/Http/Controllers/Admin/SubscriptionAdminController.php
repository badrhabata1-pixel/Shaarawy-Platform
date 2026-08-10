<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\Subscription;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => Subscription::with([
                'student:id,name',
                'unit:id,title',
                'lesson:id,title',
            ])->orderByDesc('id')->get(),
            'students' => Student::orderByDesc('id')->get(['id', 'name']),
            'units'    => Unit::orderByDesc('id')->get(['id', 'title']),
            'lessons'  => Lesson::orderByDesc('id')->get(['id', 'title']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subscriptions/Form', [
            'students' => Student::orderByDesc('id')->get(['id', 'name']),
            'units'    => Unit::orderByDesc('id')->get(['id', 'title']),
            'lessons'  => Lesson::orderByDesc('id')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id'    => ['required', 'exists:students,id'],
            'unit_id'       => ['nullable', 'exists:units,id'],
            'lesson_id'     => ['nullable', 'exists:lessons,id'],
            'price'         => ['required', 'numeric'],
            'status'        => ['required', 'in:pending,active,rejected'],
            'payment_proof' => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('payment_proof')) {
            $data['payment_proof'] = $request->file('payment_proof')->store('subscriptions', 'public');
        }

        Subscription::create($data);

        return redirect()->route('admin.subscriptions.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Subscription $subscription)
    {
        return Inertia::render('Admin/Subscriptions/Form', [
            'item'     => $subscription,
            'students' => Student::orderByDesc('id')->get(['id', 'name']),
            'units'    => Unit::orderByDesc('id')->get(['id', 'title']),
            'lessons'  => Lesson::orderByDesc('id')->get(['id', 'title']),
        ]);
    }

    public function update(Request $request, Subscription $subscription)
    {
        $data = $request->validate([
            'student_id'    => ['required', 'exists:students,id'],
            'unit_id'       => ['nullable', 'exists:units,id'],
            'lesson_id'     => ['nullable', 'exists:lessons,id'],
            'price'         => ['required', 'numeric'],
            'status'        => ['required', 'in:pending,active,rejected'],
            'payment_proof' => ['nullable', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('payment_proof')) {
            $data['payment_proof'] = $request->file('payment_proof')->store('subscriptions', 'public');
        } else {
            unset($data['payment_proof']);
        }

        $subscription->update($data);

        return redirect()->route('admin.subscriptions.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }

    public function approve($id)
    {
        $subscription = Subscription::findOrFail($id);
        $subscription->update(['status' => 'active']);

        return back()->with('success', 'تم قبول الاشتراك بنجاح ✓');
    }

    public function reject($id)
    {
        $subscription = Subscription::findOrFail($id);
        $subscription->update(['status' => 'rejected']);

        return back()->with('success', 'تم رفض الاشتراك ✓');
    }
}
