<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet extends Model
{
    protected $table = 'sheets';

    protected $fillable = ['title', 'lesson_id', 'description', 'file_path', 'total_marks'];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'sheet_id');
    }

    public function answers()
    {
        return $this->hasMany(SheetAnswer::class);
    }
}
