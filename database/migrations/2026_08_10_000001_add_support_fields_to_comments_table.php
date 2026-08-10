<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('body');
            $table->string('voice_path')->nullable()->after('image_path');
            $table->text('reply_body')->nullable()->after('voice_path');
            $table->string('reply_image_path')->nullable()->after('reply_body');
            $table->string('reply_voice_path')->nullable()->after('reply_image_path');
            $table->timestamp('replied_at')->nullable()->after('reply_voice_path');
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn([
                'image_path',
                'voice_path',
                'reply_body',
                'reply_image_path',
                'reply_voice_path',
                'replied_at',
            ]);
        });
    }
};
