<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'parent_phone',
        'academic_year_id',
        'group_id',
        'student_type',
        'center_code',
        'governorate',
        'image',
        'is_active',
        'status',
        'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password'      => 'hashed',
        'is_active'     => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /* ── Accessors ─────────────────────────────── */

    /**
     * جلب الاسم الكامل بشكل مرن للغاية بتجميع الاسمين أو قراءة حقل الـ name
     */
    public function getFullNameAttribute(): string
    {
        // التحقق من الحقول الفردية أولاً وتجميعها إن وجدت
        if (!empty($this->first_name) || !empty($this->last_name)) {
            return trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));
        }
        
        // في حال عدم وجودها نرجع حقل الـ name المدمج أو اسماً افتراضياً لمنع الـ Null Error
        return $this->name ?? 'طالب الصيفي';
    }

    /**
     * استخراج الحروف الأولى للاسم لعرضها في الأفاتار الافتراضي
     */
    public function getInitialsAttribute(): string
    {
        $fullName = $this->full_name;
        $parts = explode(' ', trim($fullName));
        $initials = mb_substr($parts[0], 0, 1);
        if (count($parts) > 1) {
            $initials .= mb_substr(end($parts), 0, 1);
        }
        return mb_strtoupper($initials);
    }

    /**
     * احتساب لقب ومستوى الطالب بناءً على متوسط درجاته تلقائياً
     */
    public function getLevelBadgeAttribute(): array
    {
        $average = $this->quizAverage();

        if ($this->progress()->whereNotNull('quiz_score')->count() === 0) {
            return ['title' => 'مبتدئ 🎯', 'color' => '#6c757d', 'bg' => 'rgba(108, 117, 125, 0.1)'];
        }

        if ($average >= 90) {
            return ['title' => 'وحش التاريخ 🏛️', 'color' => '#059669', 'bg' => 'rgba(5, 150, 105, 0.1)'];
        } elseif ($average >= 75) {
            return ['title' => 'طالب متميز ✨', 'color' => '#DCD001', 'bg' => 'rgba(220, 208, 1, 0.1)'];
        } elseif ($average >= 50) {
            return ['title' => 'مجتهد 💪', 'color' => '#F47C20', 'bg' => 'rgba(244, 124, 32, 0.1)'];
        } else {
            return ['title' => 'محتاج شدة حيل ⚠️', 'color' => '#EF4444', 'bg' => 'rgba(239, 68, 68, 0.1)'];
        }
    }

    /* ── Relationships ──────────────────────────── */

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function progress()
    {
        return $this->hasMany(StudentLessonProgress::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function sheetAnswers()
    {
        return $this->hasMany(SheetAnswer::class);
    }

    public function examResults()
    {
        return $this->hasMany(ExamResult::class);
    }

    public function topRankings()
    {
        return $this->hasMany(TopStudent::class);
    }

    /* ── Helpers ────────────────────────────────── */

    public function hasUnlockedLesson(int $lessonId): bool
    {
        return $this->progress()
            ->where('lesson_id', $lessonId)
            ->where('is_unlocked', true)
            ->exists();
    }

    public function hasPassedQuiz(int $lessonId): bool
    {
        return $this->progress()
            ->where('lesson_id', $lessonId)
            ->where('quiz_passed', true)
            ->exists();
    }

    public function quizAverage(): float
    {
        $scores = $this->progress()->whereNotNull('quiz_score')->pluck('quiz_score');
        return $scores->count() > 0 ? round($scores->avg(), 1) : 0;
    }
}