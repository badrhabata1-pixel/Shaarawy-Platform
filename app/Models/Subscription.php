<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'student_id', 'class_id', 'unit_id', 'lesson_id', 'type',
        'price', 'start_date', 'end_date', 'status', 'is_active', 'payment_method',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'class_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
