<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = ['name', 'price', 'description', 'image', 'level'];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'class_id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'class_id');
    }

    public function topStudents()
    {
        return $this->hasMany(TopStudent::class);
    }

    /* Alias for student portal (used as "grade") */
    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Unit::class, 'academic_year_id', 'unit_id');
    }
}
