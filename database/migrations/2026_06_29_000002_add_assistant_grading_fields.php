<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exam_responses', function (Blueprint $table) {
            if (!Schema::hasColumn('exam_responses', 'marks_awarded')) {
                $table->decimal('marks_awarded', 6, 2)->nullable()->after('is_correct');
            }
            if (!Schema::hasColumn('exam_responses', 'teacher_note')) {
                $table->text('teacher_note')->nullable()->after('marks_awarded');
            }
            if (!Schema::hasColumn('exam_responses', 'graded_by')) {
                $table->foreignId('graded_by')->nullable()->after('teacher_note')->constrained('admins')->nullOnDelete();
            }
            if (!Schema::hasColumn('exam_responses', 'graded_at')) {
                $table->timestamp('graded_at')->nullable()->after('graded_by');
            }
        });

        Schema::table('sheet_responses', function (Blueprint $table) {
            if (!Schema::hasColumn('sheet_responses', 'is_correct')) {
                $table->boolean('is_correct')->nullable()->after('marks_awarded');
            }
            if (!Schema::hasColumn('sheet_responses', 'graded_by')) {
                $table->foreignId('graded_by')->nullable()->after('teacher_note')->constrained('admins')->nullOnDelete();
            }
            if (!Schema::hasColumn('sheet_responses', 'graded_at')) {
                $table->timestamp('graded_at')->nullable()->after('graded_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sheet_responses', function (Blueprint $table) {
            if (Schema::hasColumn('sheet_responses', 'graded_at')) {
                $table->dropColumn('graded_at');
            }
            if (Schema::hasColumn('sheet_responses', 'graded_by')) {
                $table->dropConstrainedForeignId('graded_by');
            }
            if (Schema::hasColumn('sheet_responses', 'is_correct')) {
                $table->dropColumn('is_correct');
            }
        });

        Schema::table('exam_responses', function (Blueprint $table) {
            if (Schema::hasColumn('exam_responses', 'graded_at')) {
                $table->dropColumn('graded_at');
            }
            if (Schema::hasColumn('exam_responses', 'graded_by')) {
                $table->dropConstrainedForeignId('graded_by');
            }
            if (Schema::hasColumn('exam_responses', 'teacher_note')) {
                $table->dropColumn('teacher_note');
            }
            if (Schema::hasColumn('exam_responses', 'marks_awarded')) {
                $table->dropColumn('marks_awarded');
            }
        });
    }
};
