<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use Inertia\Inertia;

class ExamGradeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ExamGrades/Index', [
            'grades' => ExamResult::with([
                'student:id,name',
                'exam:id,title',
            ])->orderByDesc('id')->get(),
        ]);
    }
}
