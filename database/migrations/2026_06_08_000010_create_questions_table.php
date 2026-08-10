<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Shared questions table for both sheets and exams
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->nullable()->constrained('exams')->cascadeOnDelete();
            $table->foreignId('sheet_id')->nullable()->constrained('sheets')->cascadeOnDelete();
            $table->text('question_text');
            $table->string('question_type')->default('text');  // text | image
            $table->string('answer_type')->default('essay');   // essay | mcq
            $table->unsignedInteger('marks')->default(1);
            $table->string('correct_answer')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
