<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SheetAnswer extends Model
{
    protected $fillable = ['student_id', 'sheet_id', 'total_score', 'status', 'feedback'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function sheet()
    {
        return $this->belongsTo(Sheet::class);
    }

    public function responses()
    {
        return $this->hasMany(SheetResponse::class);
    }
}
