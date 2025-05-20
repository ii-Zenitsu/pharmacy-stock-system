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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('bar_code')->unique()->index();
            $table->string('dosage');
            $table->enum('formulation', ['tablet', 'syrup', 'injection', 'ointment']);
            $table->decimal('price', 8, 2);
            $table->string('image')->nullable();
            $table->unsignedInteger('alert_threshold');
            $table->foreignId('provider_id')->nullable()->constrained('providers')->onDelete('set null')->index();
            $table->boolean('automatic_reorder')->default(true);
            $table->unsignedInteger('reorder_quantity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
