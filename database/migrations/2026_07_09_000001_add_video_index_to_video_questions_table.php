<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('video_questions', function (Blueprint $table) {
            // 0 = main video, 1 = first extra video, 2 = second extra video, ...
            $table->unsignedTinyInteger('video_index')->default(0)->after('lesson_id');
        });
    }

    public function down(): void
    {
        Schema::table('video_questions', function (Blueprint $table) {
            $table->dropColumn('video_index');
        });
    }
};
