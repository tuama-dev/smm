<?php

namespace App\Models;

use App\Models\Scopes\TeamScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PostTarget represents a publishing job for a post to a specific social profile.
 *
 * Security: Uses TeamScope to automatically filter by current_team_id,
 * preventing IDOR vulnerabilities when fetching post targets.
 */
#[ScopedBy([TeamScope::class])]
class PostTarget extends Model
{
    use HasFactory, HasUlids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'team_id',
        'post_id',
        'social_profile_id',
        'status',
        'attempt_count',
        'next_attempt_at',
        'response_log',
        'published_at',
        'platform_post_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attempt_count' => 'integer',
            'next_attempt_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Get the team that owns this post target.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the post for this target.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Get the social profile for this target.
     */
    public function socialProfile(): BelongsTo
    {
        return $this->belongsTo(SocialProfile::class);
    }

    /**
     * Scope to pending targets.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to failed targets.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope to targets ready for retry.
     */
    public function scopeReadyForRetry($query)
    {
        return $query->whereIn('status', ['pending', 'retrying'])
            ->where(function ($q) {
                $q->whereNull('next_attempt_at')
                    ->orWhere('next_attempt_at', '<=', now());
            });
    }
}
