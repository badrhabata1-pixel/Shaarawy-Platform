<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value')->nullable();
            $table->timestamps();
        });

        // Seed default values
        DB::table('payment_settings')->insert([
            ['key' => 'vodafone_number',  'value' => '01000000000', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'instapay_number',  'value' => '01000000000', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'vodafone_name',    'value' => 'محمد الصيفي', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'instapay_name',    'value' => 'محمد الصيفي', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
