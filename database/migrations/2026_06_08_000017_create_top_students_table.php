<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('top_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->unsignedTinyInteger('rank');
            $table->string('month'); // format: 2026-01
            $table->timestamps();

            $table->unique(['student_id', 'academic_year_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('top_students');
    }
};
