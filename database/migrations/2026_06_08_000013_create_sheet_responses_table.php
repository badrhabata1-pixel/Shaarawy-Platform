<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sheet_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sheet_answer_id')->constrained('sheet_answers')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->text('student_answer')->nullable();
            $table->string('answer_image')->nullable();
            $table->decimal('marks_awarded', 6, 2)->nullable();
            $table->text('teacher_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sheet_responses');
    }
};
