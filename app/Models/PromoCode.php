<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = [
        'code', 'academic_year_id', 'lesson_id', 'used_by', 'used_at', 'is_used',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
    ];

    /* ── Relationships ──────────────────────────── */

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function usedBy()
    {
        return $this->belongsTo(Student::class, 'used_by');
    }

    /* ── Static Helpers ─────────────────────────── */

    public static function bulkGenerate(int $academicYearId, int $count = 20, ?int $lessonId = null): int
    {
        $created = 0;
        for ($i = 0; $i < $count; $i++) {
            $code = str_pad(random_int(1000000000, 9999999999), 10, '0', STR_PAD_LEFT);
            if (!static::where('code', $code)->exists()) {
                static::create([
                    'code'             => $code,
                    'academic_year_id' => $academicYearId,
                    'lesson_id'        => $lessonId,
                ]);
                $created++;
            }
        }
        return $created;
    }

    public static function redeem(string $code, Student $student): bool
    {
        $promo = static::where('code', $code)
            ->where('is_used', false)
            ->where('academic_year_id', $student->academic_year_id)
            ->first();

        if (!$promo) return false;

        $promo->update([
            'is_used' => true,
            'used_by' => $student->id,
            'used_at' => now(),
        ]);

        if ($promo->lesson_id) {
            StudentLessonProgress::updateOrCreate(
                ['student_id' => $student->id, 'lesson_id' => $promo->lesson_id],
                ['is_unlocked' => true, 'unlocked_at' => now()]
            );
        } else {
            // Unlock ALL lessons for this academic year
            $lessonIds = Lesson::whereHas('unit', fn ($q) =>
                $q->where('academic_year_id', $promo->academic_year_id)
            )->pluck('id');

            foreach ($lessonIds as $lessonId) {
                StudentLessonProgress::updateOrCreate(
                    ['student_id' => $student->id, 'lesson_id' => $lessonId],
                    ['is_unlocked' => true, 'unlocked_at' => now()]
                );
            }
        }

        return true;
    }
}
