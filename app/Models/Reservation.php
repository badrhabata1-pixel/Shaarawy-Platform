<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'name', 'phone', 'address', 'school', 'parent_name', 'parent_phone',
        'parent_job', 'code', 'group_id', 'study_type', 'gender', 'is_paid',
    ];

    protected $casts = ['is_paid' => 'boolean'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
