<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AdminModel;
use App\Models\PaymentReceipt;
use App\Models\PaymentSetting;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PaymentFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_settings_and_receipts_work_for_student_teacher_and_assistant(): void
    {
        $year = AcademicYear::create(['name' => 'Grade 3', 'level' => 3]);
        $student = Student::create([
            'name' => 'Test Student',
            'email' => 'student-payment@example.com',
            'password' => Hash::make('password'),
            'phone' => '01011111111',
            'academic_year_id' => $year->id,
            'is_active' => true,
            'status' => 'active',
        ]);
        $teacher = User::create([
            'name' => 'Teacher',
            'email' => 'teacher-payment@example.com',
            'password' => Hash::make('password'),
        ]);
        $assistant = AdminModel::create([
            'name' => 'Assistant',
            'email' => 'assistant-payment@example.com',
            'password' => Hash::make('password'),
            'role' => 'assistant',
        ]);

        $this->actingAs($teacher)
            ->post(route('admin.payment-settings.update'), [
                'vodafone_number' => '01099999999',
                'vodafone_name' => 'Vodafone Teacher',
                'instapay_number' => 'teacher@instapay',
                'instapay_name' => 'Instapay Teacher',
            ])
            ->assertRedirect();

        $this->assertSame('01099999999', PaymentSetting::get('vodafone_number'));
        $this->assertSame('teacher@instapay', PaymentSetting::get('instapay_number'));

        $this->actingAs($student, 'student')
            ->get(route('student.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Dashboard')
                ->where('subscription.vodafone_number', '01099999999')
                ->where('subscription.instapay_number', 'teacher@instapay')
            );

        $this->actingAs($student, 'student')
            ->post(route('student.receipts.store'), [
                'payment_method' => 'vodafone_cash',
                'receipt_image' => UploadedFile::fake()->createWithContent(
                    'receipt.png',
                    base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=')
                ),
            ])
            ->assertRedirect();

        $receipt = PaymentReceipt::query()->firstOrFail();
        $this->assertSame($student->id, $receipt->student_id);
        $this->assertSame('vodafone_cash', $receipt->payment_method);
        $this->assertSame('pending', $receipt->status);

        $this->actingAs($teacher)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->has('receipts', 1)
                ->where('paymentNumbers.vodafone_number', '01099999999')
            );

        $this->actingAs($assistant, 'assistant')
            ->get(route('assistant.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Assistant/Dashboard')
                ->has('receipts', 1)
            );

        $this->actingAs($teacher)
            ->post(route('admin.receipts.approve', $receipt))
            ->assertRedirect();
        $this->assertSame('approved', $receipt->fresh()->status);

        $rejectedReceipt = PaymentReceipt::create([
            'student_id' => $student->id,
            'image' => 'manual-receipt.jpg',
            'payment_method' => 'instapay',
            'status' => 'pending',
        ]);

        $this->actingAs($assistant, 'assistant')
            ->post(route('assistant.receipts.reject', $rejectedReceipt))
            ->assertRedirect();
        $this->assertSame('rejected', $rejectedReceipt->fresh()->status);
    }
}
