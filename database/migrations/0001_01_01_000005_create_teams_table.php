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
        Schema::create('teams', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique()->index();
            $table->boolean('personal_team')->default(false);
            $table->bigInteger('storage_used_kb')->default(0);

            // Cashier billing fields
            $table->string('stripe_id')->nullable()->index();
            $table->string('pm_type')->nullable();
            $table->string('pm_last_four', 4)->nullable();
            $table->timestamp('trial_ends_at')->nullable();

            $table->timestamps();
        });

        // Add foreign key for current_team_id in users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('current_team_id')->references('id')->on('teams')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['current_team_id']);
        });

        Schema::dropIfExists('teams');
    }
};
