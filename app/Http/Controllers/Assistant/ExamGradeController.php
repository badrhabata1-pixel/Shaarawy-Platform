<?php

namespace App\Http\Controllers\Assistant;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamGradeController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $query = ExamResult::with(['student:id,name', 'exam:id,title,total_marks']);

        if ($search !== '') {
            $query->whereHas('student', fn ($students) => $students->where('name', 'like', "%{$search}%"));
        }

        return Inertia::render('Assistant/ExamGrades/Index', [
            'grades' => $query->orderByDesc('id')->get(),
            'filters' => ['search' => $search],
            'assistant' => auth()->guard('assistant')->user(),
        ]);
    }
}
