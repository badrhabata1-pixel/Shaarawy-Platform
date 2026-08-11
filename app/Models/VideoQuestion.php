<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoQuestion extends Model
{
    protected $fillable = [
        'lesson_id', 'question_text', 'options', 'correct_answer', 'position',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function logs()
    {
        return $this->hasMany(VideoQuestionLog::class);
    }
}
