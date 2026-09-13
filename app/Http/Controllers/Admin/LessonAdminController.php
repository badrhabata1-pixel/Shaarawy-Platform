<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class LessonAdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Lessons/Index', [
            'lessons' => Lesson::with('unit.academicYear:id,name')->orderByDesc('id')->get(),
            'units'   => Unit::with('academicYear:id,name')->orderByDesc('id')->get(['id', 'title', 'academic_year_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Lessons/Form', [
            'units' => Unit::with('academicYear:id,name')->orderByDesc('id')->get(['id', 'title', 'academic_year_id']),
            'exams' => \App\Models\Exam::orderByDesc('id')->get(['id', 'title', 'class_id', 'total_marks']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'              => ['required', 'string', 'max:255'],
            'unit_id'            => ['required', 'exists:units,id'],
            'description'        => ['nullable', 'string'],
            'lesson_number'      => ['nullable', 'integer'],
            'duration_minutes'   => ['nullable', 'integer'],
            'is_locked'          => ['boolean'],
            'is_published'       => ['boolean'],
            'video_url'          => ['nullable', 'url'],
            'video_file'         => ['nullable', 'file', 'mimes:mp4,mov,avi,webm,mkv,m4v', 'max:512000'],
            'extra_video_urls'   => ['nullable', 'array'],
            'extra_video_urls.*.file' => ['nullable', 'file', 'mimes:mp4,mov,avi,webm,mkv,m4v', 'max:512000'],
            'image'              => ['nullable', 'image', 'max:3072'],
            'pdf_file'           => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'pdf_file_2'         => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'extra_pdfs'         => ['nullable', 'array'],
            'extra_pdfs.*'       => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'gate_exam_id'       => ['nullable', 'exists:exams,id'],
        ]);
        $data['gate_exam_id'] = $data['gate_exam_id'] ?: null;

        try {
            if ($request->hasFile('image')) {
                $data['image'] = $this->saveFile($request->file('image'), 'uploads/lessons/images');
            }
            if ($request->hasFile('pdf_file')) {
                $data['pdf_file'] = $this->saveFile($request->file('pdf_file'), 'uploads/lessons/pdfs');
            }
            if ($request->hasFile('pdf_file_2')) {
                $data['pdf_file_2'] = $this->saveFile($request->file('pdf_file_2'), 'uploads/lessons/pdfs');
            }
            if ($request->hasFile('video_file')) {
                $data['video_url'] = asset($this->saveFile($request->file('video_file'), 'uploads/lessons/videos'));
            }
            unset($data['video_file']);

            $extraPdfPaths = [];
            if ($request->hasFile('extra_pdfs')) {
                foreach ($request->file('extra_pdfs') as $pdf) {
                    if ($pdf) {
                        $extraPdfPaths[] = $this->saveFile($pdf, 'uploads/lessons/pdfs');
                    }
                }
            }
            $data['extra_pdfs'] = $extraPdfPaths ?: null;

            foreach ($data['extra_video_urls'] ?? [] as $i => &$v) {
                if (is_array($v)) {
                    if ($request->hasFile("extra_video_urls.$i.file")) {
                        $v['url'] = asset($this->saveFile($request->file("extra_video_urls.$i.file"), 'uploads/lessons/videos'));
                    }
                    unset($v['file']);
                }
            }
            unset($v);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['pdf_file' => $e->getMessage()])->withInput();
        }

        $extraVideos = array_values(array_filter(
            $data['extra_video_urls'] ?? [],
            fn($v) => is_array($v) ? !empty($v['url']) : !empty($v)
        ));
        $data['extra_video_urls'] = $extraVideos ?: null;

        Lesson::create($data);

        return redirect()->route('admin.lessons.index')->with('success', 'تم الإضافة بنجاح ✓');
    }

    public function edit(Lesson $lesson)
    {
        return Inertia::render('Admin/Lessons/Form', [
            'item'  => $lesson,
            'units' => Unit::with('academicYear:id,name')->orderByDesc('id')->get(['id', 'title', 'academic_year_id']),
            'exams' => \App\Models\Exam::orderByDesc('id')->get(['id', 'title', 'class_id', 'total_marks']),
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'title'              => ['required', 'string', 'max:255'],
            'unit_id'            => ['required', 'exists:units,id'],
            'description'        => ['nullable', 'string'],
            'lesson_number'      => ['nullable', 'integer'],
            'duration_minutes'   => ['nullable', 'integer'],
            'is_locked'          => ['boolean'],
            'is_published'       => ['boolean'],
            'video_url'          => ['nullable', 'url'],
            'video_file'         => ['nullable', 'file', 'mimes:mp4,mov,avi,webm,mkv,m4v', 'max:512000'],
            'extra_video_urls'   => ['nullable', 'array'],
            'extra_video_urls.*.file' => ['nullable', 'file', 'mimes:mp4,mov,avi,webm,mkv,m4v', 'max:512000'],
            'image'              => ['nullable', 'image', 'max:3072'],
            'pdf_file'           => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'pdf_file_2'         => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'extra_pdfs'         => ['nullable', 'array'],
            'extra_pdfs.*'       => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'gate_exam_id'       => ['nullable', 'exists:exams,id'],
        ]);
        $data['gate_exam_id'] = $data['gate_exam_id'] ?: null;

        try {
            if ($request->hasFile('image')) {
                $data['image'] = $this->saveFile($request->file('image'), 'uploads/lessons/images');
            } else {
                unset($data['image']);
            }
            if ($request->hasFile('pdf_file')) {
                $data['pdf_file'] = $this->saveFile($request->file('pdf_file'), 'uploads/lessons/pdfs');
            } else {
                unset($data['pdf_file']);
            }
            if ($request->hasFile('pdf_file_2')) {
                $data['pdf_file_2'] = $this->saveFile($request->file('pdf_file_2'), 'uploads/lessons/pdfs');
            } else {
                unset($data['pdf_file_2']);
            }
            if ($request->hasFile('video_file')) {
                $data['video_url'] = asset($this->saveFile($request->file('video_file'), 'uploads/lessons/videos'));
            }
            unset($data['video_file']);

            $existingPdfs = $lesson->extra_pdfs ?? [];
            $newPdfs = [];
            if ($request->hasFile('extra_pdfs')) {
                foreach ($request->file('extra_pdfs') as $pdf) {
                    if ($pdf) {
                        $newPdfs[] = $this->saveFile($pdf, 'uploads/lessons/pdfs');
                    }
                }
            }
            $mergedPdfs = array_values(array_filter(array_merge($existingPdfs, $newPdfs)));
            $data['extra_pdfs'] = $mergedPdfs ?: null;

            foreach ($data['extra_video_urls'] ?? [] as $i => &$v) {
                if (is_array($v)) {
                    if ($request->hasFile("extra_video_urls.$i.file")) {
                        $v['url'] = asset($this->saveFile($request->file("extra_video_urls.$i.file"), 'uploads/lessons/videos'));
                    }
                    unset($v['file']);
                }
            }
            unset($v);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['pdf_file' => $e->getMessage()])->withInput();
        }

        $extraVideos = array_values(array_filter(
            $data['extra_video_urls'] ?? [],
            fn($v) => is_array($v) ? !empty($v['url']) : !empty($v)
        ));
        $data['extra_video_urls'] = $extraVideos ?: null;

        $lesson->update($data);

        return redirect()->route('admin.lessons.index')->with('success', 'تم التعديل بنجاح ✓');
    }

    public function destroy(Lesson $lesson)
    {
        $lesson->delete();

        return back()->with('success', 'تم الحذف بنجاح ✓');
    }

    private function saveFile(UploadedFile $file, string $subdir): string
    {
        $dir = public_path($subdir);
        if (!file_exists($dir) && !mkdir($dir, 0755, true) && !file_exists($dir)) {
            throw new \RuntimeException("تعذّر إنشاء المجلد $subdir — تأكد إن مجلد public قابل للكتابة على السيرفر.");
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException("مجلد $subdir غير قابل للكتابة على السيرفر — راجع صلاحيات الملفات (permissions).");
        }
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);
        return $subdir . '/' . $filename;
    }
}
