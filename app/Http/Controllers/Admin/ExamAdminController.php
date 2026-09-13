<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\QuestionChoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExamAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Exams/Index', [
            'exams'   => Exam::with(['lesson:id,title', 'academicYear:id,name'])->orderByDesc('id')->get(),
            'lessons' => Lesson::orderByDesc('id')->get(['id', 'title']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Exams/Form', [
            'lessons'       => Lesson::orderByDesc('id')->get(['id', 'title']),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    private function parseQuestions(\Illuminate\Http\Request $request): array
    {
        $raw = $request->input('questions_json', '[]');
        if (is_array($raw)) {
            return $raw;
        }
        return json_decode($raw, true) ?? [];
    }

    /* ── helper: save questions after exam create/update ── */
    private function syncQuestions(Exam $exam, array $questions, Request $request): void
    {
        // IMPORTANT: never blindly delete-and-recreate every question on every edit.
        // question_id on exam_responses cascadeOnDelete()s, so wiping all questions
        // here would silently destroy every student's already-submitted answers on
        // this exam the moment an admin edits it (even just to change a mark value).
        // Instead: update existing questions in place (matched by id) and only
        // delete the ones the admin actually removed from the form.
        $existingQuestions = $exam->questions()->get()->keyBy('id');
        $incomingIds = collect($questions)->pluck('id')->filter()->map(fn ($id) => (int) $id);

        foreach ($existingQuestions as $id => $old) {
            if (!$incomingIds->contains($id)) {
                if ($old->image_path) {
                    Storage::disk('public')->delete($old->image_path);
                }
                $old->delete();
            }
        }

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

            $attrs = [
                'question_text'  => $q['question_text']  ?? '',
                'question_type'  => $q['question_type']  ?? 'mcq',
                'answer_type'    => 'text',
                'marks'          => max(1, (int) ($q['marks'] ?? 1)),
                'correct_answer' => isset($q['correct_answer']) ? trim($q['correct_answer']) : null,
                'image_path'     => $imagePath,
            ];

            $existingId = isset($q['id']) ? (int) $q['id'] : null;
            $question   = $existingId ? $existingQuestions->get($existingId) : null;

            if ($question) {
                $question->update($attrs);
                // Choices carry no foreign key from exam_responses (selected_answer is
                // free text), so it's safe to always drop and re-add them.
                $question->choices()->delete();
            } else {
                $question = $exam->questions()->create($attrs);
            }

            if (($q['question_type'] ?? 'mcq') === 'mcq') {
                foreach ($q['choices'] ?? [] as $choiceText) {
                    if (trim($choiceText) !== '') {
                        $question->choices()->create(['choice_text' => trim($choiceText)]);
                    }
                }
            }
        }

        // Keep total_marks in sync with the actual sum of question marks so the
        // pass/fail threshold (computed from total_marks) always matches what
        // students can really score — an out-of-sync total_marks was causing
        // students who answered every question correctly to still be marked "failed".
        $exam->update(['total_marks' => max(1, $exam->questions()->sum('marks'))]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'               => ['required', 'string', 'max:255'],
            'class_id'            => ['required', 'exists:academic_years,id'],
            'lesson_id'           => ['nullable', 'exists:lessons,id'],
            'description'         => ['nullable', 'string'],
            'time_limit_minutes'  => ['nullable', 'integer', 'min:1'],
            'total_marks'         => ['nullable', 'integer', 'min:1'],
            'exam_type'           => ['nullable', 'in:open,closed'],
            'exam_mode'           => ['nullable', 'in:gate,final'],
            'start_time'          => ['nullable', 'date'],
            'end_time'            => ['nullable', 'date'],
            'image'               => ['nullable', 'image', 'max:3072'],
        ]);

        $data['exam_mode'] = $data['exam_mode'] ?? 'final';

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('exams', 'public');
        }

        $exam = Exam::create($data);
        $this->syncQuestions($exam, $this->parseQuestions($request), $request);

        return redirect()->route('admin.exams.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Exam $exam)
    {
        $exam->load('questions.choices');
        return Inertia::render('Admin/Exams/Form', [
            'item'          => $exam,
            'lessons'       => Lesson::orderByDesc('id')->get(['id', 'title']),
            'academicYears' => AcademicYear::orderByDesc('id')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'title'               => ['required', 'string', 'max:255'],
            'class_id'            => ['required', 'exists:academic_years,id'],
            'lesson_id'           => ['nullable', 'exists:lessons,id'],
            'description'         => ['nullable', 'string'],
            'time_limit_minutes'  => ['nullable', 'integer', 'min:1'],
            'total_marks'         => ['nullable', 'integer', 'min:1'],
            'exam_type'           => ['nullable', 'in:open,closed'],
            'exam_mode'           => ['nullable', 'in:gate,final'],
            'start_time'          => ['nullable', 'date'],
            'end_time'            => ['nullable', 'date'],
            'image'               => ['nullable', 'image', 'max:3072'],
        ]);

        $data['exam_mode'] = $data['exam_mode'] ?? 'final';

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('exams', 'public');
        } else {
            unset($data['image']);
        }

        $exam->update($data);
        $this->syncQuestions($exam, $this->parseQuestions($request), $request);

        return redirect()->route('admin.exams.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }
}
