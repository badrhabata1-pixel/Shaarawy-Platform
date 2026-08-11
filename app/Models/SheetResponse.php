<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetResponse extends Model
{
    protected $fillable = [
        'sheet_answer_id', 'question_id', 'student_answer',
        'answer_image', 'marks_awarded', 'is_correct', 'teacher_note',
        'graded_by', 'graded_at',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'graded_at' => 'datetime',
    ];

    public function sheetAnswer()
    {
        return $this->belongsTo(SheetAnswer::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
