<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialAuthService;
use Illuminate\Http\RedirectResponse;

class SocialAuthController extends Controller
{
    public function __construct(
        protected SocialAuthService $socialAuthService
    ) {}

    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(string $provider): RedirectResponse
    {
        return $this->socialAuthService->redirectToProvider($provider);
    }

    /**
     * Handle the OAuth provider callback.
     */
    public function callback(string $provider)
    {
        try {
            $this->socialAuthService->handleProviderCallback($provider);

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            return redirect()->route('signin')->with('error', 'Unable to authenticate with '.ucfirst($provider).'. Please try again.');
        }
    }
}
