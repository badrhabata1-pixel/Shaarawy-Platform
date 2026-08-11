<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('recorded_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->date('lesson_date');
            $table->string('status')->default('absent');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['group_id', 'student_id', 'lesson_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
