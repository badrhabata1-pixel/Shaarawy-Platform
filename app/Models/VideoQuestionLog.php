<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoQuestionLog extends Model
{
    protected $fillable = [
        'student_id', 'lesson_id', 'video_question_id',
        'is_answered', 'chosen_option', 'is_correct',
        'triggered_at', 'answered_at',
    ];

    protected $casts = [
        'is_answered'  => 'boolean',
        'is_correct'   => 'boolean',
        'triggered_at' => 'datetime',
        'answered_at'  => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function question()
    {
        return $this->belongsTo(VideoQuestion::class, 'video_question_id');
    }
}
