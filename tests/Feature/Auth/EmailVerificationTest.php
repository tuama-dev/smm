<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

uses(RefreshDatabase::class);

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

beforeEach(function () {
    Notification::fake();
});

// Verification Notice Page Tests
it('displays email verification notice for unverified users', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/email/verify')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Auth/VerifyEmail'));
});

it('allows verified users to access verification notice page', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->get('/email/verify')
        ->assertSuccessful();
});

it('requires authentication to view verification notice', function () {
    get('/email/verify')
        ->assertRedirect('/signin');
});

// Email Verification Tests
it('can verify email with valid signed URL', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertRedirect('/dashboard');

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('redirects to dashboard with verification status', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this->actingAs($user)->get($verificationUrl);

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('verified', true);
});

it('marks email as verified in database', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)->get($verificationUrl);

    assertDatabaseHas('users', [
        'id' => $user->id,
        'email_verified_at' => $user->fresh()->email_verified_at,
    ]);

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

// Invalid Verification Tests
it('rejects verification with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => 'invalid-hash']
    );

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('rejects verification with expired URL', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->subMinutes(1), // Expired 1 minute ago
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('rejects verification for wrong user', function () {
    $user1 = User::factory()->unverified()->create();
    $user2 = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user1->id, 'hash' => sha1($user1->email)]
    );

    // User 2 trying to use User 1's verification link
    $this->actingAs($user2)
        ->get($verificationUrl)
        ->assertForbidden();

    expect($user1->fresh()->hasVerifiedEmail())->toBeFalse();
    expect($user2->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('requires authentication for email verification', function () {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    get($verificationUrl)->assertRedirect('/signin');
});

// Resend Verification Email Tests
it('can resend verification email', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertRedirect();

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('shows status message after resending verification email', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertSessionHas('status', 'verification-link-sent');
});

it('does not resend if already verified', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertRedirect('/dashboard');

    Notification::assertNothingSent();
});

it('throttles verification email resend attempts', function () {
    $user = User::factory()->unverified()->create();

    // Make 6 resend requests
    for ($i = 0; $i < 6; $i++) {
        $this->actingAs($user)->post('/email/verification-notification');
    }

    // 7th attempt should be throttled
    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertStatus(429); // Too Many Requests
});

it('requires authentication to resend verification email', function () {
    post('/email/verification-notification')
        ->assertRedirect('/signin');
});

// Multiple Verification Attempts
it('does not send duplicate verification if already verified', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertRedirect('/dashboard');

    // Should still be verified with same timestamp
    expect($user->fresh()->email_verified_at->timestamp)
        ->toBe($user->email_verified_at->timestamp);
});

// Edge Cases
it('handles verification with changed email', function () {
    $user = User::factory()->unverified()->create(['email' => 'old@example.com']);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    // User changes email before clicking verification link
    $user->update(['email' => 'new@example.com']);

    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

it('allows verification after email change if hash matches new email', function () {
    $user = User::factory()->unverified()->create(['email' => 'test@example.com']);

    // Create verification URL with current email
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    // Verify with matching email
    $this->actingAs($user)
        ->get($verificationUrl)
        ->assertRedirect('/dashboard');

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});
