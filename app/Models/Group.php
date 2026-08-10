<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'name', 'description', 'academic_year_id', 'hour',
        'assistant_id', 'start_date', 'end_date', 'attendance_type', 'image',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function assistant()
    {
        return $this->belongsTo(AdminModel::class, 'assistant_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
