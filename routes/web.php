<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes (unauthenticated users only)
Route::middleware('guest')->group(function () {
    Route::get('/signup', [RegisterController::class, 'create'])->name('signup');
    Route::post('/signup', [RegisterController::class, 'store']);
    
    Route::get('/signin', [LoginController::class, 'create'])->name('signin');
    Route::post('/signin', [LoginController::class, 'store']);
    
    // Social authentication routes - extensible for any provider
    Route::get('/auth/{provider}', [SocialAuthController::class, 'redirect'])->name('social.redirect');
    Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
});

// Email Verification routes
Route::middleware('auth')->group(function () {
    Route::get('/email/verify', [App\Http\Controllers\Auth\EmailVerificationController::class, 'notice'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [App\Http\Controllers\Auth\EmailVerificationController::class, 'verify'])->middleware(['signed'])->name('verification.verify');
    Route::post('/email/verification-notification', [App\Http\Controllers\Auth\EmailVerificationController::class, 'resend'])->middleware(['throttle:6,1'])->name('verification.send');
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/logout', LogoutController::class)->name('logout');
    
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Post Scheduling Routes
    Route::get('/posts/schedule', [App\Http\Controllers\PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [App\Http\Controllers\PostController::class, 'store'])->name('posts.store');
});

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'name' => 'Laravel Developer',
    ]);
});
