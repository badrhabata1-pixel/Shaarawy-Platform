<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('video_question_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained('lessons')->cascadeOnDelete();
            $table->foreignId('video_question_id')->constrained('video_questions')->cascadeOnDelete();
            $table->boolean('is_answered')->default(false);
            $table->string('chosen_option', 1)->nullable(); // a | b | c | d
            $table->boolean('is_correct')->nullable();
            $table->timestamp('triggered_at')->nullable(); // when overlay appeared
            $table->timestamp('answered_at')->nullable();  // when student submitted
            $table->timestamps();

            $table->unique(['student_id', 'video_question_id'], 'vql_student_question_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_question_logs');
    }
};
