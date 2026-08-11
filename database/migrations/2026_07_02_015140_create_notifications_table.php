<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * تشغيل وتفعيل جدول الإشعارات في قاعدة البيانات
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable(); // عنوان الإشعار
            $table->text('text'); // نص الإشعار والتنبيه
            $table->string('sender_name')->default('السكرتارية'); // اسم المرسل
            
            // ربط الإشعار بصف دراسي معين ليرسل لصف محدد (أو لجميع الطلاب إن ترك فارغاً)
            $table->foreignId('academic_year_id')
                ->nullable()
                ->constrained('academic_years')
                ->nullOnDelete();
                
            $table->timestamps();
        });
    }

    /**
     * إلغاء وحذف جدول الإشعارات
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};