<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AdminModel;
use App\Models\Group;
use App\Models\Lesson;
use App\Models\PromoCode;
use App\Models\Student;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Admin user (Laravel web guard) ───────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@sweefy.com'],
            ['name' => 'الأستاذ محمد منصور', 'password' => Hash::make('password')]
        );

        // ── 2. Teacher record in admins table (used by admin PHP panel) ─────
        AdminModel::updateOrCreate(
            ['email' => 'teacher@sweefy.com'],
            [
                'name'     => 'الأستاذ محمد منصور',
                'password' => password_hash('password', PASSWORD_DEFAULT),
                'role'     => 'teacher',
                'phone'    => '01000000000',
            ]
        );

        AdminModel::updateOrCreate(
            ['email' => 'assistant@sweefy.com'],
            [
                'name'     => 'سكرتارية المنصة',
                'password' => Hash::make('12345678'),
                'role'     => 'assistant',
                'phone'    => '01000000001',
            ]
        );

        // ── 3. Academic years (school grades) ──────────────────────────────
        $grade1 = AcademicYear::updateOrCreate(
            ['name' => 'الصف الأول الثانوي'],
            ['price' => 500, 'level' => 1, 'description' => 'المرحلة الأولى من الثانوية العامة']
        );

        $grade2 = AcademicYear::updateOrCreate(
            ['name' => 'الصف الثاني الثانوي'],
            ['price' => 550, 'level' => 2, 'description' => 'المرحلة الثانية من الثانوية العامة']
        );

        $grade3 = AcademicYear::updateOrCreate(
            ['name' => 'الصف الثالث الثانوي'],
            ['price' => 600, 'level' => 3, 'description' => 'المرحلة النهائية — الثانوية العامة']
        );

        // ── 4. Units for grade 3 ────────────────────────────────────────────
        $unit1 = Unit::updateOrCreate(
            ['title' => 'الوحدة الأولى', 'academic_year_id' => $grade3->id],
            ['price' => 0, 'term' => 'first', 'description' => 'مقدمة في التاريخ الحديث']
        );

        // ── 5. Group for grade 3 ────────────────────────────────────────────
        $group = Group::updateOrCreate(
            ['name' => 'مجموعة الثانوية أ', 'academic_year_id' => $grade3->id],
            ['hour' => '4:00 م', 'attendance_type' => 'weekly']
        );

        // ── 6. Demo student ────────────────────────────────────────────────
        $student = Student::updateOrCreate(
            ['email' => 'student@sweefy.com'],
            [
                'name'             => 'أحمد العربي',
                'password'         => Hash::make('password'),
                'phone'            => '01012345678',
                'parent_phone'     => '01112345678',
                'governorate'      => 'القاهرة',
                'student_type'     => 'online',
                'status'           => 'active',
                'is_active'        => true,
                'academic_year_id' => $grade3->id,
                'group_id'         => $group->id,
            ]
        );

        // ── 7. Demo lessons ────────────────────────────────────────────────
        $lesson1 = Lesson::updateOrCreate(
            ['unit_id' => $unit1->id, 'lesson_number' => 1],
            [
                'title'            => 'المحاضرة الأولى: الحملة الفرنسية وأسباب مجيئها',
                'description'      => 'شرح وافٍ للظروف الدولية التي أدت للحملة الفرنسية.',
                'image'            => 'https://images.unsplash.com/photo-1543165796-54000777737e?w=800&auto=format&fit=crop',
                'video_url'        => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 45,
                'is_locked'        => false,
                'passing_score'    => 60,
                'is_published'     => true,
            ]
        );

        $lesson2 = Lesson::updateOrCreate(
            ['unit_id' => $unit1->id, 'lesson_number' => 2],
            [
                'title'            => 'المحاضرة الثانية: ثورة القاهرة الأولى',
                'description'      => 'ردود فعل الشعب المصري على الحملة الفرنسية.',
                'image'            => 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop',
                'video_url'        => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'duration_minutes' => 60,
                'is_locked'        => true,
                'passing_score'    => 60,
                'is_published'     => true,
            ]
        );

        // ── 8. Demo promo codes ────────────────────────────────────────────
        PromoCode::updateOrCreate(
            ['code' => '9876543210'],
            ['lesson_id' => $lesson2->id, 'is_used' => false]
        );

        PromoCode::updateOrCreate(
            ['code' => '5555555555'],
            ['lesson_id' => null, 'is_used' => false]
        );
    }
}
