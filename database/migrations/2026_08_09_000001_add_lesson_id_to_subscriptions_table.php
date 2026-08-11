<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->foreignId('lesson_id')->nullable()->after('unit_id')
                ->constrained('lessons')->nullOnDelete();
        });

        DB::statement('ALTER TABLE subscriptions MODIFY class_id BIGINT UNSIGNED NULL');
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['lesson_id']);
            $table->dropColumn('lesson_id');
        });

        DB::statement('ALTER TABLE subscriptions MODIFY class_id BIGINT UNSIGNED NOT NULL');
    }
};
