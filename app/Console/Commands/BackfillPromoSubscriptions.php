<?php

namespace App\Console\Commands;

use App\Models\PromoCode;
use App\Models\Student;
use App\Models\Subscription;
use App\Models\Unit;
use Illuminate\Console\Command;

class BackfillPromoSubscriptions extends Command
{
    /**
     * إصلاح لمرة واحدة: أكواد اتفعّلت قبل ربط تفعيل الكود بفتح اشتراك الوحدة،
     * فالدروس فتحت لكن الطالب فضل شايف الوحدة نفسها "مقفولة" في صفحة رحلة التعلّم.
     */
    protected $signature = 'promo:backfill-subscriptions';

    protected $description = 'يفتح اشتراك الوحدة لكل الطلاب اللي فعّلوا كود تفعيل قبل إصلاح الربط بين الكود واشتراك الوحدة';

    public function handle(): int
    {
        $redeemed = PromoCode::where('is_used', true)->whereNotNull('used_by')->get();

        $fixed = 0;

        foreach ($redeemed as $promo) {
            /** @var Student|null $student */
            $student = Student::find($promo->used_by);
            if (!$student) continue;

            $unitIds = $promo->lesson_id
                ? collect([$promo->lesson?->unit_id])->filter()
                : Unit::where('academic_year_id', $promo->academic_year_id)->pluck('id');

            foreach ($unitIds as $unitId) {
                $sub = Subscription::where('student_id', $student->id)
                    ->where('unit_id', $unitId)
                    ->first();

                if ($sub && $sub->is_active) continue;

                Subscription::updateOrCreate(
                    ['student_id' => $student->id, 'unit_id' => $unitId],
                    [
                        'class_id'       => $promo->academic_year_id,
                        'type'           => 'unit',
                        'status'         => 'active',
                        'is_active'      => true,
                        'payment_method' => 'promo_code',
                        'start_date'     => now()->toDateString(),
                    ]
                );
                $fixed++;
            }
        }

        $this->info("تم فتح {$fixed} اشتراك وحدة كان ناقص لطلاب فعّلوا أكواد قبل كده.");

        return self::SUCCESS;
    }
}
