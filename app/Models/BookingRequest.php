<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingRequest extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'school',
        'address',
        'parent_name',
        'parent_phone',
        'parent_job',
        'group_id',
        'gender',
        'status',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
