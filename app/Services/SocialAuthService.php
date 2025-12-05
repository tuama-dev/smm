<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthService
{
    /**
     * Redirect to the OAuth provider.
     */
    public function redirectToProvider(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the OAuth provider callback.
     */
    public function handleProviderCallback(string $provider): User
    {
        $providerUser = Socialite::driver($provider)->user();

        $user = $this->findOrCreateUser($providerUser, $provider);

        Auth::login($user);

        return $user;
    }

    /**
     * Find or create a user based on the provider data.
     */
    protected function findOrCreateUser($providerUser, string $provider): User
    {
        // Check if user already exists with this provider
        $user = User::where('provider', $provider)
            ->where('provider_id', $providerUser->getId())
            ->first();

        if ($user) {
            return $user;
        }

        // Check if user exists with this email
        $user = User::where('email', $providerUser->getEmail())->first();

        if ($user) {
            // Link the social account to existing user
            $user->update([
                'provider' => $provider,
                'provider_id' => $providerUser->getId(),
            ]);

            return $user;
        }

        // Create new user
        return User::create([
            'name' => $providerUser->getName(),
            'email' => $providerUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $providerUser->getId(),
            'password' => null, // Social login users don't have a password
        ]);
    }
}
