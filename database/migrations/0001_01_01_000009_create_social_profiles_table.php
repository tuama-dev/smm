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
        Schema::create('social_profiles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('team_id')->constrained()->cascadeOnDelete();
            $table->enum('platform', ['instagram', 'facebook', 'tiktok', 'linkedin']);
            $table->string('provider_id')->index();
            $table->string('name')->nullable();
            $table->string('handle')->nullable();
            $table->string('avatar_url')->nullable();
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->boolean('is_connected')->default(true);
            $table->timestamps();

            $table->unique(['team_id', 'platform', 'provider_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_profiles');
    }
};
