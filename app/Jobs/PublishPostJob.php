<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PublishPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Post $post
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Stub: Log the publish attempt
        // Real implementation will call social media APIs
        Log::info("Publishing post ID: {$this->post->id}");

        // Update status to published (for now)
        $this->post->update(['status' => 'published']);

        Log::info("Post ID: {$this->post->id} marked as published");
    }
}
