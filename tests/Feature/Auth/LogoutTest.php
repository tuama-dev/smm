<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

use function Pest\Laravel\assertGuest;
use function Pest\Laravel\post;

it('can logout authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');

    assertGuest();
});

it('invalidates session on logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $sessionId = session()->getId();

    post('/logout');

    // Session should be invalidated
    expect(session()->getId())->not->toBe($sessionId);
});

it('regenerates CSRF token on logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $oldToken = csrf_token();

    post('/logout');

    $newToken = csrf_token();

    expect($oldToken)->not->toBe($newToken);
});

it('requires authentication to logout', function () {
    post('/logout')
        ->assertRedirect('/signin');

    assertGuest();
});

it('cannot logout twice', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/logout');

    // Try to logout again
    post('/logout')->assertRedirect('/signin');
});

it('clears remember me cookie on logout', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    // Login with remember me
    post('/signin', [
        'email' => $user->email,
        'password' => 'password123',
        'remember' => true,
    ]);

    // Logout
    $response = post('/logout');

    // Remember cookie should be cleared
    $response->assertCookie('remember_web_'.sha1(static::class), null);
});

it('redirects to home page after logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');
});
