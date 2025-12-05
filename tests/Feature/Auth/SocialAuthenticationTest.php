<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Mockery as m;

uses(RefreshDatabase::class);

use function Pest\Laravel\assertAuthenticated;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;

// Redirect to Provider Tests
it('redirects to google oauth provider', function () {
    $response = get('/auth/google');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('accounts.google.com');
});

it('redirects to instagram oauth provider', function () {
    $response = get('/auth/instagram');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('instagram.com');
});

it('supports dynamic provider names', function () {
    // Test that any provider name works (extensible)
    Config::set('services.facebook', [
        'client_id' => 'test-id',
        'client_secret' => 'test-secret',
        'redirect' => 'http://smm.test/auth/facebook/callback',
    ]);

    $response = get('/auth/facebook');
    $response->assertRedirect();
});

// OAuth Callback - New User Tests
it('creates a new user from google oauth', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback')->assertRedirect('/dashboard');

    assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'name' => 'John Doe',
        'provider' => 'google',
        'provider_id' => 'google-123',
    ]);
});

it('creates user with verified email from social login', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    $user = User::where('email', 'john@example.com')->first();
    expect($user->hasVerifiedEmail())->toBeTrue();
});

it('creates user without password for social login', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    $user = User::where('email', 'john@example.com')->first();
    expect($user->password)->toBeNull();
});

it('authenticates user after social login', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    assertAuthenticated();
    expect(auth()->user()->email)->toBe('john@example.com');
});

// OAuth Callback - Existing User Tests
it('logs in existing user with same provider', function () {
    $existingUser = User::factory()->create([
        'email' => 'john@example.com',
        'provider' => 'google',
        'provider_id' => 'google-123',
        'email_verified_at' => now(),
    ]);

    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    assertAuthenticated();
    expect(auth()->user()->id)->toBe($existingUser->id);
});

it('links social account to existing email', function () {
    // User already exists with email but no social login
    $existingUser = User::factory()->create([
        'email' => 'john@example.com',
        'provider' => null,
        'provider_id' => null,
    ]);

    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    $user = $existingUser->fresh();
    expect($user->provider)->toBe('google')
        ->and($user->provider_id)->toBe('google-123');

    assertAuthenticated();
});

it('updates user name from social provider if different', function () {
    $existingUser = User::factory()->create([
        'email' => 'john@example.com',
        'name' => 'Old Name',
        'provider' => 'google',
        'provider_id' => 'google-123',
    ]);

    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('New Name');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    expect($existingUser->fresh()->name)->toBe('New Name');
});

// Multiple Providers Tests
it('allows user to link multiple social providers', function () {
    // User signs up with Google
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'provider' => 'google',
        'provider_id' => 'google-123',
    ]);

    // Same user logs in with Instagram (same email)
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('instagram-456');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/instagram/callback');

    // Provider should be updated to latest
    $user = $user->fresh();
    expect($user->provider)->toBe('instagram')
        ->and($user->provider_id)->toBe('instagram-456');
});

// Error Handling Tests
it('handles missing email from provider gracefully', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn(null);
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    expect(fn () => get('/auth/google/callback'))
        ->toThrow(Exception::class);
});

it('handles missing name from provider', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn(null);

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    get('/auth/google/callback');

    $user = User::where('email', 'john@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBeNull();
});

// Provider-Specific Tests
it('works with different provider formats', function () {
    $providers = ['google', 'instagram', 'facebook', 'github', 'twitter'];

    foreach ($providers as $provider) {
        Config::set("services.{$provider}", [
            'client_id' => 'test-id',
            'client_secret' => 'test-secret',
            'redirect' => "http://smm.test/auth/{$provider}/callback",
        ]);

        $socialiteUser = m::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getId')->andReturn("{$provider}-123");
        $socialiteUser->shouldReceive('getEmail')->andReturn("{$provider}@example.com");
        $socialiteUser->shouldReceive('getName')->andReturn(ucfirst($provider) . ' User');

        Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

        get("/auth/{$provider}/callback");

        assertDatabaseHas('users', [
            'email' => "{$provider}@example.com",
            'provider' => $provider,
            'provider_id' => "{$provider}-123",
        ]);
    }
});

// Guest Middleware Tests
it('redirects authenticated users away from social auth redirect', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/auth/google')
        ->assertRedirect('/dashboard');
});

// Session Management Tests
it('regenerates session after social login', function () {
    $socialiteUser = m::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getId')->andReturn('google-123');
    $socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $socialiteUser->shouldReceive('getName')->andReturn('John Doe');

    Socialite::shouldReceive('driver->user')->andReturn($socialiteUser);

    $oldSessionId = session()->getId();

    get('/auth/google/callback');

    $newSessionId = session()->getId();

    expect($oldSessionId)->not->toBe($newSessionId);
});
