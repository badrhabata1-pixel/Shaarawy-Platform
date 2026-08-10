<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLessonProgress extends Model
{
    protected $table = 'student_lesson_progress';

    protected $fillable = [
        'student_id',
        'lesson_id',
        'is_unlocked',
        'unlocked_at',
        'watch_percentage',
        'last_watched_at',
        'quiz_score',
        'quiz_passed',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'is_unlocked'      => 'boolean',
        'quiz_passed'      => 'boolean',
        'is_completed'     => 'boolean',
        'unlocked_at'      => 'datetime',
        'completed_at'     => 'datetime',
        'last_watched_at'  => 'datetime',
    ];

    /* ── Relationships ──────────────────────────── */

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
