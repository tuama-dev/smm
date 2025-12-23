<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Cashier\Billable;

class Team extends Model
{
    use Billable, HasFactory, HasUlids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'personal_team',
        'storage_used_kb',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'personal_team' => 'boolean',
            'storage_used_kb' => 'integer',
            'trial_ends_at' => 'datetime',
        ];
    }

    /**
     * Get the team owner.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all members of the team.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Get the current subscription.
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latest();
    }

    /**
     * Get all subscriptions.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get all invoices.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get social profiles connected to this team.
     */
    public function socialProfiles(): HasMany
    {
        return $this->hasMany(SocialProfile::class);
    }

    /**
     * Get all media files.
     */
    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    /**
     * Get all posts.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get all post targets.
     */
    public function postTargets(): HasMany
    {
        return $this->hasMany(PostTarget::class);
    }

    /**
     * Get activity logs.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    /**
     * Get the current plan for the team.
     */
    public function currentPlan(): ?Plan
    {
        return $this->subscription?->plan;
    }
}
