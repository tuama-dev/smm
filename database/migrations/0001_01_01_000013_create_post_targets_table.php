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
        Schema::create('post_targets', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // team_id included for IDOR prevention via GlobalScope
            $table->foreignUlid('team_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('post_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('social_profile_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['pending', 'processing', 'published', 'failed', 'retrying'])->default('pending');
            $table->unsignedSmallInteger('attempt_count')->default(0);
            $table->timestamp('next_attempt_at')->nullable();
            $table->text('response_log')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('platform_post_id')->nullable();
            $table->timestamps();

            $table->index(['team_id', 'status']);
            $table->index(['post_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_targets');
    }
};
