<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('price', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('image')->nullable();           // thumbnail
            $table->string('pdf_file')->nullable();        // worksheet 1
            $table->string('pdf_file_2')->nullable();      // worksheet 2
            $table->string('video_url')->nullable();       // stream URL
            $table->unsignedInteger('lesson_number')->default(1); // order within unit
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            // Student-portal fields
            $table->unsignedSmallInteger('duration_minutes')->default(0);
            $table->boolean('is_locked')->default(true);
            $table->boolean('is_published')->default(true);
            $table->unsignedTinyInteger('passing_score')->default(60);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
