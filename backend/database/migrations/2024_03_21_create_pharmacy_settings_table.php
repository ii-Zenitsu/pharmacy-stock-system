<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pharmacy_settings', function (Blueprint $table) {
            $table->id();
            $table->string('day_of_week');
            $table->time('opening_time');
            $table->time('closing_time');
            $table->boolean('is_closed')->default(false);
            $table->string('special_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pharmacy_settings');
    }
}; 