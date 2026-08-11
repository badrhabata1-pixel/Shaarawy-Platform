<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Sheet;
use App\Models\SheetAnswer;
use App\Models\SheetResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SheetController extends Controller
{
    public function index()
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        $sheets = Sheet::whereHas('lesson.unit', fn ($q) =>
                $q->where('academic_year_id', $student->academic_year_id)
            )
            ->with([
                'lesson:id,title,unit_id',
                'lesson.unit:id,title,academic_year_id',
                'answers' => fn ($q) =>
                    $q->where('student_id', $student->id)->select('id', 'sheet_id', 'total_score', 'status', 'created_at'),
            ])
            ->orderByDesc('id')
            ->get();

        $list = $sheets->map(fn (Sheet $sheet) => [
            'id'          => $sheet->id,
            'title'       => $sheet->title,
            'description' => $sheet->description,
            'total_marks' => $sheet->total_marks,
            'has_pdf'     => (bool) $sheet->file_path,
            'pdf_url'     => $sheet->file_path
                ? asset('storage/' . $sheet->file_path)
                : null,
            'lesson_title' => $sheet->lesson?->title,
            'unit_title'   => $sheet->lesson?->unit?->title,
            'questions_count' => $sheet->questions()->count(),
            'answer'      => $sheet->answers->first()
                ? [
                    'id'          => $sheet->answers->first()->id,
                    'score'       => $sheet->answers->first()->total_score,
                    'status'      => $sheet->answers->first()->status,
                    'submitted_at'=> $sheet->answers->first()->created_at?->format('Y-m-d H:i'),
                ]
                : null,
        ]);

        return Inertia::render('Student/Sheets', [
            'sheets' => $list,
        ]);
    }

    public function show($id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();
        $sheet   = Sheet::with(['questions.choices', 'lesson'])->findOrFail($id);

        $existingAnswer = SheetAnswer::where('sheet_id', $sheet->id)
            ->where('student_id', $student->id)
            ->with('responses')
            ->first();

        $responseMap = $existingAnswer
            ? $existingAnswer->responses->keyBy('question_id')
            : collect();

        return Inertia::render('Student/SheetShow', [
            'sheet' => [
                'id'           => $sheet->id,
                'title'        => $sheet->title,
                'description'  => $sheet->description,
                'total_marks'  => $sheet->total_marks,
                'has_pdf'      => (bool) $sheet->file_path,
                'pdf_url'      => $sheet->file_path ? asset('storage/' . $sheet->file_path) : null,
                'lesson_title' => $sheet->lesson?->title,
                'questions'    => $sheet->questions->map(fn ($q) => [
                    'id'            => $q->id,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type,
                    'marks'         => $q->marks,
                    'image_path'    => $q->image_path,
                    'choices'       => $q->choices->pluck('choice_text'),
                    'correct_answer'=> $existingAnswer ? $q->correct_answer : null,
                ]),
            ],
            'existing_answer' => $existingAnswer ? [
                'status'      => $existingAnswer->status,
                'total_score' => $existingAnswer->total_score,
                'feedback'    => $existingAnswer->feedback,
                'responses'   => $responseMap->map(fn ($r) => [
                    'student_answer' => $r->student_answer,
                    'marks_awarded'  => $r->marks_awarded,
                    'teacher_note'   => $r->teacher_note,
                ]),
            ] : null,
        ]);
    }

    public function submit(Request $request, $id)
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();
        $sheet   = Sheet::with('questions.choices')->findOrFail($id);

        // prevent double submission
        if (SheetAnswer::where('sheet_id', $sheet->id)->where('student_id', $student->id)->exists()) {
            return redirect()->route('student.sheets.show', $sheet->id);
        }

        $answers = $request->input('answers', []);

        $sheetAnswer = SheetAnswer::create([
            'student_id' => $student->id,
            'sheet_id'   => $sheet->id,
            'status'     => 'pending',
            'total_score'=> 0,
        ]);

        $mcqScore  = 0;
        $hasPending = false;

        foreach ($sheet->questions as $question) {
            $studentAns  = $answers[$question->id] ?? null;
            $marksAwarded = null;

            if ($question->question_type === 'mcq') {
                $isCorrect    = $studentAns !== null && $studentAns === $question->correct_answer;
                $marksAwarded = $isCorrect ? $question->marks : 0;
                $mcqScore    += $isCorrect ? $question->marks : 0;
            } else {
                $hasPending = true;
            }

            SheetResponse::create([
                'sheet_answer_id' => $sheetAnswer->id,
                'question_id'     => $question->id,
                'student_answer'  => $studentAns,
                'marks_awarded'   => $marksAwarded,
            ]);
        }

        $sheetAnswer->update([
            'total_score' => $mcqScore,
            'status'      => $hasPending ? 'pending' : 'graded',
        ]);

        return redirect()->route('student.sheets.show', $sheet->id);
    }
}
