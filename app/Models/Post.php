<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'team_id',
        'created_by',
        'caption',
        'post_type',
        'scheduled_at',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    /**
     * Get the team that owns this post.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user who created this post.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get media attached to this post.
     */
    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'post_media')
            ->withPivot('order')
            ->withTimestamps()
            ->orderByPivot('order');
    }

    /**
     * Get publishing targets for this post.
     */
    public function targets(): HasMany
    {
        return $this->hasMany(PostTarget::class);
    }

    /**
     * Scope to scheduled posts.
     */
    public function scopeScheduled($query)
    {
        return $query->whereNotNull('scheduled_at')
            ->where('status', 'scheduled');
    }

    /**
     * Scope to drafts.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}
