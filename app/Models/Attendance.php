<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'group_id',
        'student_id',
        'recorded_by',
        'lesson_date',
        'status',
        'note',
    ];

    protected $casts = [
        'lesson_date' => 'date',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function recorder()
    {
        return $this->belongsTo(AdminModel::class, 'recorded_by');
    }
}
