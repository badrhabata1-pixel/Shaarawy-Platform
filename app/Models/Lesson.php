<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'title',
        'price',
        'description',
        'image',
        'pdf_file',
        'pdf_file_2',
        'extra_pdfs',
        'video_url',
        'extra_video_urls',
        'lesson_number',
        'unit_id',
        'duration_minutes',
        'is_locked',
        'is_published',
        'passing_score',
        'gate_exam_id',
    ];

    protected $casts = [
        'is_locked'         => 'boolean',
        'is_published'      => 'boolean',
        'extra_video_urls'  => 'array',
        'extra_pdfs'        => 'array',
    ];

    /* ── Accessors (portal compatibility) ──────── */

    public function getStreamUrlAttribute(): ?string
    {
        return $this->video_url;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->image;
    }

    public function getOrderAttribute(): int
    {
        return $this->lesson_number;
    }

    public function getDurationFormattedAttribute(): string
    {
        $h = intdiv($this->duration_minutes, 60);
        $m = $this->duration_minutes % 60;
        if ($h > 0 && $m > 0) return "{$h} ساعة {$m} دقيقة";
        if ($h > 0)            return "{$h} ساعة";
        return "{$m} دقيقة";
    }

    /* ── Relationships ──────────────────────────── */

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function sheets()
    {
        return $this->hasMany(Sheet::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function gateExam()
    {
        return $this->belongsTo(Exam::class, 'gate_exam_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function studentProgress()
    {
        return $this->hasMany(StudentLessonProgress::class);
    }

    /* ── Helpers ────────────────────────────────── */

    public function progressFor(Student $student): ?StudentLessonProgress
    {
        return $this->studentProgress()
            ->where('student_id', $student->id)
            ->first();
    }
}
