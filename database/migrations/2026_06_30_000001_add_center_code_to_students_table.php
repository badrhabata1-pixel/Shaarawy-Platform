<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'center_code')) {
                $table->string('center_code')->nullable()->unique()->after('student_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'center_code')) {
                $table->dropUnique(['center_code']);
                $table->dropColumn('center_code');
            }
        });
    }
};
