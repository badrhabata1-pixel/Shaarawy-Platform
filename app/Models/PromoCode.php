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

            $unitId = $promo->lesson?->unit_id;
            if ($unitId) {
                static::activateUnitSubscription($student, $unitId, $promo->academic_year_id);
            }
        } else {
            // Unlock ALL lessons for this academic year
            $unitIds = Unit::where('academic_year_id', $promo->academic_year_id)->pluck('id');

            $lessonIds = Lesson::whereIn('unit_id', $unitIds)->pluck('id');
            foreach ($lessonIds as $lessonId) {
                StudentLessonProgress::updateOrCreate(
                    ['student_id' => $student->id, 'lesson_id' => $lessonId],
                    ['is_unlocked' => true, 'unlocked_at' => now()]
                );
            }

            // كود عام للصف كله لازم يفتح "الوحدة" نفسها كمان — مش بس الدروس اللي جواها
            // عشان صفحة "رحلة التعلّم" بتتحقق من الاشتراك على الوحدة مش من فتح الدروس
            foreach ($unitIds as $unitId) {
                static::activateUnitSubscription($student, $unitId, $promo->academic_year_id);
            }
        }

        return true;
    }

    /**
     * فتح بوابة الوحدة للطالب (Subscription) عشان يقدر يدخلها من صفحة رحلة التعلّم أصلاً
     */
    private static function activateUnitSubscription(Student $student, int $unitId, int $academicYearId): void
    {
        Subscription::updateOrCreate(
            ['student_id' => $student->id, 'unit_id' => $unitId],
            [
                'class_id'       => $academicYearId,
                'type'           => 'unit',
                'status'         => 'active',
                'is_active'      => true,
                'payment_method' => 'promo_code',
                'start_date'     => now()->toDateString(),
            ]
        );
    }
}
