<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\QuestionChoice;
use App\Models\Sheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SheetController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sheets/Index', [
            'sheets'  => Sheet::with('lesson:id,title')->orderByDesc('id')->get(),
            'lessons' => Lesson::orderByDesc('id')->get(['id', 'title']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sheets/Form', [
            'lessons'       => $this->lessonsWithClass(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'lesson_id'   => ['required', 'exists:lessons,id'],
            'description' => ['nullable', 'string'],
            'total_marks' => ['nullable', 'integer', 'min:0'],
            'pdf_file'    => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
        ]);

        if ($request->hasFile('pdf_file')) {
            try {
                $data['file_path'] = $request->file('pdf_file')->store('sheets/pdfs', 'public');
            } catch (\Throwable $e) {
                return back()->withErrors(['pdf_file' => 'فشل رفع الملف: ' . $e->getMessage()])->withInput();
            }
        }
        unset($data['pdf_file']);

        $sheet = Sheet::create($data);
        $this->syncQuestions($sheet, $this->parseQuestions($request), $request);

        return redirect()->route('admin.sheets.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Sheet $sheet)
    {
        $sheet->load('questions.choices');
        return Inertia::render('Admin/Sheets/Form', [
            'item'          => $sheet,
            'lessons'       => $this->lessonsWithClass(),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Sheet $sheet)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'lesson_id'   => ['required', 'exists:lessons,id'],
            'description' => ['nullable', 'string'],
            'total_marks' => ['nullable', 'integer', 'min:0'],
            'pdf_file'    => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
        ]);

        if ($request->hasFile('pdf_file')) {
            try {
                $data['file_path'] = $request->file('pdf_file')->store('sheets/pdfs', 'public');
            } catch (\Throwable $e) {
                return back()->withErrors(['pdf_file' => 'فشل رفع الملف: ' . $e->getMessage()])->withInput();
            }
        }
        unset($data['pdf_file']);

        $sheet->update($data);
        $this->syncQuestions($sheet, $this->parseQuestions($request), $request);

        return redirect()->route('admin.sheets.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Sheet $sheet)
    {
        $sheet->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }

    /* ── helpers ─────────────────────────────────── */

    private function lessonsWithClass(): \Illuminate\Support\Collection
    {
        return Lesson::leftJoin('units', 'lessons.unit_id', '=', 'units.id')
            ->orderBy('lessons.lesson_number')
            ->get(['lessons.id', 'lessons.title', 'units.academic_year_id'])
            ->map(fn ($l) => [
                'id'               => $l->id,
                'title'            => $l->title,
                'academic_year_id' => $l->academic_year_id,
            ]);
    }

    private function parseQuestions(Request $request): array
    {
        $raw = $request->input('questions_json', '[]');
        if (is_array($raw)) {
            return $raw;
        }
        return json_decode($raw, true) ?? [];
    }

    private function syncQuestions(Sheet $sheet, array $questions, Request $request): void
    {
        // Images still referenced by the incoming questions must survive the wipe below
        $keepPaths = collect($questions)->pluck('existing_image_path')->filter()->all();

        foreach ($sheet->questions as $old) {
            if ($old->image_path && !in_array($old->image_path, $keepPaths, true)) {
                Storage::disk('public')->delete($old->image_path);
            }
        }
        $sheet->questions()->delete();

        foreach ($questions as $i => $q) {
            $imagePath = $q['existing_image_path'] ?? null;

            if (!empty($q['remove_image']) && $imagePath) {
                Storage::disk('public')->delete($imagePath);
                $imagePath = null;
            }

            if ($request->hasFile("question_images.$i")) {
                if ($imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
                $imagePath = $request->file("question_images.$i")->store('questions', 'public');
            }

            $question = $sheet->questions()->create([
                'question_text'  => $q['question_text']  ?? '',
                'question_type'  => $q['question_type']  ?? 'essay',
                'answer_type'    => 'text',
                'marks'          => max(1, (int) ($q['marks'] ?? 1)),
                'correct_answer' => $q['correct_answer'] ?? null,
                'image_path'     => $imagePath,
            ]);

            if (($q['question_type'] ?? 'essay') === 'mcq') {
                foreach ($q['choices'] ?? [] as $choiceText) {
                    if (trim($choiceText) !== '') {
                        $question->choices()->create(['choice_text' => trim($choiceText)]);
                    }
                }
            }
        }
    }
}
