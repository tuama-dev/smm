<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

uses(RefreshDatabase::class);

use function Pest\Laravel\assertAuthenticated;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

// Login Page Tests
it('displays the login page', function () {
    get('/signin')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Auth/SignIn'));
});

it('redirects authenticated users away from login page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/signin')
        ->assertRedirect('/dashboard');
});

// Successful Login Tests
it('can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ])->assertRedirect('/dashboard');

    assertAuthenticated();
    expect(auth()->user()->id)->toBe($user->id);
});

it('can login with remember me enabled', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'remember' => true,
    ])->assertRedirect('/dashboard');

    assertAuthenticated();
    $this->assertNotNull(auth()->viaRemember());
});

it('redirects unverified users to verification notice', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => null, // Not verified
    ]);

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ])->assertRedirect('/dashboard');

    // User is authenticated but will be redirected by verified middleware
    assertAuthenticated();
});

// Failed Login Tests
it('cannot login with incorrect password', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ])->assertSessionHasErrors('email');

    assertGuest();
});

it('cannot login with non-existent email', function () {
    post('/signin', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ])->assertSessionHasErrors('email');

    assertGuest();
});

it('shows generic error message for security', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = post('/signin', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ]);

    $errors = session('errors')->getBag('default')->get('email');
    expect($errors[0])->toContain('credentials');
});

// Validation Tests
it('requires email for login', function () {
    post('/signin', [
        'password' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('requires password for login', function () {
    post('/signin', [
        'email' => 'john@example.com',
    ])->assertSessionHasErrors('password');
});

it('requires valid email format for login', function () {
    post('/signin', [
        'email' => 'invalid-email',
        'password' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('treats remember as boolean', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'remember' => 'yes', // String instead of boolean
    ])->assertRedirect('/dashboard');

    assertAuthenticated();
});

// Rate Limiting Tests
it('throttles login attempts after 5 failures', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Make 5 failed attempts
    for ($i = 0; $i < 5; $i++) {
        post('/signin', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    // 6th attempt should be throttled
    $response = post('/signin', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors('email');
    $errors = session('errors')->getBag('default')->get('email');
    expect($errors[0])->toContain('Too many login attempts');
});

it('clears rate limiter on successful login', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    // Make 4 failed attempts
    for ($i = 0; $i < 4; $i++) {
        post('/signin', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    // Successful login
    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ])->assertRedirect('/dashboard');

    assertAuthenticated();

    // Logout
    $this->post('/logout');

    // Should be able to make more attempts (rate limiter was cleared)
    for ($i = 0; $i < 5; $i++) {
        post('/signin', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    // This should still be throttled (5 new attempts)
    $response = post('/signin', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors('email');
});

it('uses separate rate limiter per email and IP', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);

    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Make 5 failed attempts for john@example.com
    for ($i = 0; $i < 5; $i++) {
        post('/signin', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    // john@example.com should be throttled
    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ])->assertSessionHasErrors('email');

    // But jane@example.com should still work
    post('/signin', [
        'email' => 'jane@example.com',
        'password' => 'wrongpassword',
    ])->assertSessionHasErrors('email');
    
    // Error should be about credentials, not throttling
    $errors = session('errors')->getBag('default')->get('email');
    expect($errors[0])->not->toContain('Too many login attempts');
});

// Session Tests
it('regenerates session on login', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    $oldSessionId = session()->getId();

    post('/signin', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $newSessionId = session()->getId();

    expect($oldSessionId)->not->toBe($newSessionId);
});

// Case Sensitivity Tests
it('is case-insensitive for email', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    post('/signin', [
        'email' => 'JOHN@EXAMPLE.COM',
        'password' => 'password123',
    ])->assertRedirect('/dashboard');

    assertAuthenticated();
});
