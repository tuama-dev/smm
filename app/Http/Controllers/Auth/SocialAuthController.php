<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Supported OAuth providers.
     */
    protected array $supportedProviders = [
        'google',
        'facebook',
        'tiktok',
        'apple',
    ];

    public function __construct(
        protected SocialAccountService $socialAccountService
    ) {}

    /**
     * Redirect to OAuth provider.
     */
    public function redirect(string $provider): RedirectResponse
    {
        if (! $this->isValidProvider($provider)) {
            abort(404, 'Unsupported OAuth provider.');
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle OAuth provider callback.
     */
    public function callback(string $provider): RedirectResponse
    {
        if (! $this->isValidProvider($provider)) {
            abort(404, 'Unsupported OAuth provider.');
        }

        // Temporarily removed try-catch to debug OAuth error
        $socialUser = Socialite::driver($provider)->user();

        $user = $this->socialAccountService->findOrCreateUser($socialUser, $provider);

        Auth::login($user, remember: true);

        return redirect()->intended('/dashboard');
    }

    /**
     * Check if provider is supported.
     */
    protected function isValidProvider(string $provider): bool
    {
        return in_array($provider, $this->supportedProviders, true);
    }
}
