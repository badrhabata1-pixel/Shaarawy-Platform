<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'title', 'class_id', 'lesson_id', 'description',
        'time_limit_minutes', 'total_marks', 'exam_type', 'exam_mode',
        'start_time', 'end_time', 'image',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'class_id');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'exam_id');
    }

    public function results()
    {
        return $this->hasMany(ExamResult::class);
    }
}
