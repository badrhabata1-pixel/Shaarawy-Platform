<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->json('extra_video_urls')->nullable()->after('video_url');
            $table->json('extra_pdfs')->nullable()->after('pdf_file_2');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['extra_video_urls', 'extra_pdfs']);
        });
    }
};
