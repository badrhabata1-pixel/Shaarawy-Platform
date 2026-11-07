<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Exam extends Model
{
    protected $fillable = [
        'title', 'class_id', 'lesson_id', 'description',
        'time_limit_minutes', 'total_marks', 'exam_type', 'exam_mode',
        'start_time', 'end_time', 'image',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'class_id');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'exam_id');
    }

    public function results()
    {
        return $this->hasMany(ExamResult::class);
    }

    /**
     * "الآن" بتوقيت مصر بنفس صيغة التواريخ المحفوظة.
     * مواعيد الامتحان بتتكتب من لوحة الأدمن بالتوقيت المحلي وبتتخزن كما هي (إعداد التطبيق UTC)،
     * فلازم نقارنها بالساعة المحلية مش بـ UTC وإلا الامتحان يفتح ويقفل متأخر ساعتين.
     */
    public static function localNow(): Carbon
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', now('Africa/Cairo')->format('Y-m-d H:i:s'), 'UTC');
    }

    /** upcoming | active | ended | open (open = من غير مواعيد) */
    public function availability(): string
    {
        if (!$this->start_time && !$this->end_time) {
            return 'open';
        }

        $now = static::localNow();

        if ($this->start_time && $now->lt($this->start_time)) {
            return 'upcoming';
        }
        if ($this->end_time && $now->gt($this->end_time)) {
            return 'ended';
        }

        return 'active';
    }

    /**
     * مراجعة الإجابات (الإجابات الصحيحة وإجابات الطالب) تفتح بس بعد انتهاء وقت الامتحان.
     * امتحان من غير ميعاد نهاية مفيش وقت ينتظره، فالمراجعة مفتوحة.
     */
    public function reviewOpen(): bool
    {
        return !$this->end_time || static::localNow()->gt($this->end_time);
    }

    public function isAvailable(): bool
    {
        return in_array($this->availability(), ['open', 'active'], true);
    }
}
