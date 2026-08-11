<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->foreignId('gate_exam_id')
                  ->nullable()
                  ->after('passing_score')
                  ->constrained('exams')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropForeign(['gate_exam_id']);
            $table->dropColumn('gate_exam_id');
        });
    }
};
