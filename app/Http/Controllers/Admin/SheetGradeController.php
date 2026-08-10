<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SheetAnswer;
use Inertia\Inertia;

class SheetGradeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SheetGrades/Index', [
            'grades' => SheetAnswer::with([
                'student:id,name',
                'sheet:id,title',
            ])->orderByDesc('id')->get(),
        ]);
    }
}
