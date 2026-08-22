<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Grade;
use App\Models\Lesson;
use App\Models\PromoCode;
use Illuminate\Support\Facades\DB;

class PlatformDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. إنشاء الصفوف الدراسية أولاً (إذا لم تكن موجودة)
        $grade = Grade::firstOrCreate(
            ['level' => 3],
            ['name' => 'الصف الثالث الثانوي']
        );

        // 2. إنشاء درس أول (مفتوح ومجاني)
        Lesson::firstOrCreate(
            ['title' => 'المحاضرة الأولى: الحملة الفرنسية على مصر'],
            [
                'grade_id' => $grade->id,
                'description' => 'شرح تفصيلي لأسباب الحملة الفرنسية على مصر ومعركة أبو قير البحرية مع الأستاذ منصور.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600',
                'stream_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // رابط تجريبي
                'duration_minutes' => 45,
                'order' => 1,
                'is_locked' => false, // مفتوح تلقائياً
                'passing_score' => 60,
                'is_published' => true,
            ]
        );

        // 3. إنشاء درس ثانٍ (مغلق ويتطلب تفعيل)
        $lockedLesson = Lesson::firstOrCreate(
            ['title' => 'المحاضرة الثانية: ثورة القاهرة الأولى ومقاومة الشعب'],
            [
                'grade_id' => $grade->id,
                'description' => 'استكمال أحداث الحملة الفرنسية، ومقاومة الأزهر الشريف وأسباب اندلاع ثورة القاهرة الأولى.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1503174971373-b1f69850bdf4?q=80&w=600',
                'stream_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // رابط تجريبي
                'duration_minutes' => 60,
                'order' => 2,
                'is_locked' => true, // مقفل بشكل افتراضي
                'passing_score' => 60,
                'is_published' => true,
            ]
        );

        // 4. توليد كود تفعيل تجريبي لتجربة فتح الدرس الثاني
        // تأكد من وجود جدول promo_codes وجاهزيته
        if (Schema::hasTable('promo_codes')) {
            DB::table('promo_codes')->insertOrIgnore([
                [
                    'code' => 'SWEFY2026',
                    'lesson_id' => $lockedLesson->id,
                    'is_used' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
        }
    }
}