<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('video_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->cascadeOnDelete();
            $table->text('question_text');
            $table->json('options'); // {"a":"...","b":"...","c":"...","d":"..."}
            $table->string('correct_answer', 1); // a | b | c | d
            $table->unsignedTinyInteger('position')->default(1); // 1–4 checkpoint order
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_questions');
    }
};
