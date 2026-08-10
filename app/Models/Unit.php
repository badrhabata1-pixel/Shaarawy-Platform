<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['title', 'price', 'description', 'academic_year_id', 'term', 'image', 'is_free', 'is_visible'];

    protected $casts = [
        'is_free'    => 'boolean',
        'is_visible' => 'boolean',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('lesson_number');
    }
}
