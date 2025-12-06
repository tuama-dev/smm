<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Show the registration form.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/SignUp');
    }

    /**
     * Handle a registration request.
     */
    public function store(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        return redirect()->route('verification.notice');
    }
}
