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
    Route::get('/social', function () {
        return Inertia::render('Social/Index');
    })->name('social.index');

    // Post Scheduling Routes
    // Post Scheduling Routes
    // Post Scheduling Routes
    Route::prefix('posts')->name('posts.')->group(function () {
        Route::get('/', [App\Http\Controllers\PostController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\PostController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\PostController::class, 'store'])->name('store');
        Route::get('/scheduled', [App\Http\Controllers\PostController::class, 'scheduled'])->name('scheduled');
        
        // Edit & Update
        Route::get('/{post}/edit', [App\Http\Controllers\PostController::class, 'edit'])->name('edit');
        Route::put('/{post}', [App\Http\Controllers\PostController::class, 'update'])->name('update');
        Route::delete('/{post}', [App\Http\Controllers\PostController::class, 'destroy'])->name('destroy');
    });
});

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'name' => 'Laravel Developer',
    ]);
});
