<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_lesson_progress', function (Blueprint $table) {
            if (!Schema::hasColumn('student_lesson_progress', 'watch_percentage')) {
                $table->unsignedTinyInteger('watch_percentage')->default(0)->after('is_unlocked');
            }
            if (!Schema::hasColumn('student_lesson_progress', 'last_watched_at')) {
                $table->timestamp('last_watched_at')->nullable()->after('watch_percentage');
            }
        });
    }

    public function down(): void
    {
        Schema::table('student_lesson_progress', function (Blueprint $table) {
            if (Schema::hasColumn('student_lesson_progress', 'watch_percentage')) {
                $table->dropColumn('watch_percentage');
            }
            if (Schema::hasColumn('student_lesson_progress', 'last_watched_at')) {
                $table->dropColumn('last_watched_at');
            }
        });
    }
};
