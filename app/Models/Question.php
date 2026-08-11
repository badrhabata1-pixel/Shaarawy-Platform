<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'exam_id', 'sheet_id', 'question_text', 'question_type',
        'answer_type', 'marks', 'correct_answer', 'image_path',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function sheet()
    {
        return $this->belongsTo(Sheet::class);
    }

    public function choices()
    {
        return $this->hasMany(QuestionChoice::class);
    }
}
