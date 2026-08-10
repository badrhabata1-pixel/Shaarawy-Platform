<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentReceipt extends Model
{
    use HasFactory;

    protected $table = 'payment_receipts';

    protected $fillable = ['student_id', 'image', 'payment_method', 'status', 'notes'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
