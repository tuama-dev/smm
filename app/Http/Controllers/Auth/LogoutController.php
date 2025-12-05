<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;

class LogoutController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Handle a logout request.
     */
    public function __invoke(): RedirectResponse
    {
        $this->authService->logout();

        return redirect()->route('signin');
    }
}
