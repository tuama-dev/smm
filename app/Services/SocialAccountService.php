<?php

namespace App\Services;

use App\Models\LinkedSocialAccount;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class SocialAccountService
{
    /**
     * Find or create a user from Socialite OAuth data.
     *
     * Handles two scenarios:
     * - New User: Creates user, personal team, and links social account
     * - Existing User: Links social account if missing, returns user
     */
    public function findOrCreateUser(SocialiteUser $socialUser, string $provider): User
    {
        // First, try to find by linked social account
        $linkedAccount = LinkedSocialAccount::query()
            ->where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($linkedAccount) {
            return $this->updateAndReturnUser($linkedAccount, $socialUser);
        }

        // Try to find existing user by email
        $existingUser = User::where('email', $socialUser->getEmail())->first();

        if ($existingUser) {
            return $this->linkAccountToExistingUser($existingUser, $socialUser, $provider);
        }

        // New user - create everything
        return $this->createNewUserWithTeam($socialUser, $provider);
    }

    /**
     * Update existing linked account and return user.
     */
    protected function updateAndReturnUser(LinkedSocialAccount $linkedAccount, SocialiteUser $socialUser): User
    {
        // Update token and avatar if changed
        $linkedAccount->update([
            'token' => $socialUser->token,
            'avatar_url' => $socialUser->getAvatar(),
            'name' => $socialUser->getName(),
        ]);

        $user = $linkedAccount->user;

        // Update user avatar if not set
        if (! $user->avatar_url && $socialUser->getAvatar()) {
            $user->update(['avatar_url' => $socialUser->getAvatar()]);
        }

        return $user;
    }

    /**
     * Link social account to an existing user.
     */
    protected function linkAccountToExistingUser(User $user, SocialiteUser $socialUser, string $provider): User
    {
        $user->linkedSocialAccounts()->create([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'avatar_url' => $socialUser->getAvatar(),
            'token' => $socialUser->token,
        ]);

        // Update avatar if not set
        if (! $user->avatar_url && $socialUser->getAvatar()) {
            $user->update(['avatar_url' => $socialUser->getAvatar()]);
        }

        return $user;
    }

    /**
     * Create a new user with personal team and linked social account.
     *
     * Uses DB transaction to ensure atomicity.
     */
    protected function createNewUserWithTeam(SocialiteUser $socialUser, string $provider): User
    {
        return DB::transaction(function () use ($socialUser, $provider) {
            // Step 1: Create the user
            $user = User::create([
                'name' => $socialUser->getName() ?? $this->extractNameFromEmail($socialUser->getEmail()),
                'email' => $socialUser->getEmail(),
                'email_verified_at' => now(), // Social login verifies email
                'password' => null, // Social-only user
                'avatar_url' => $socialUser->getAvatar(),
            ]);

            // Step 2: Create personal team
            $team = $this->createPersonalTeam($user);

            // Step 3: Set current team
            $user->update(['current_team_id' => $team->id]);

            // Step 4: Link social account
            $user->linkedSocialAccounts()->create([
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'avatar_url' => $socialUser->getAvatar(),
                'token' => $socialUser->token,
            ]);

            return $user->refresh();
        });
    }

    /**
     * Create a personal team for a user.
     */
    protected function createPersonalTeam(User $user): Team
    {
        $teamName = $this->generatePersonalTeamName($user->name);

        $team = Team::create([
            'owner_id' => $user->id,
            'name' => $teamName,
            'slug' => $this->generateUniqueSlug($teamName),
            'personal_team' => true,
        ]);

        // Add owner as admin member
        $team->members()->attach($user->id, ['role' => 'admin']);

        return $team;
    }

    /**
     * Generate personal team name from user name.
     */
    protected function generatePersonalTeamName(string $userName): string
    {
        $firstName = explode(' ', $userName)[0];

        return "{$firstName}'s Team";
    }

    /**
     * Generate a unique slug for the team.
     */
    protected function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Team::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Extract name from email address.
     */
    protected function extractNameFromEmail(string $email): string
    {
        $localPart = explode('@', $email)[0];

        return Str::title(str_replace(['.', '_', '-'], ' ', $localPart));
    }
}
