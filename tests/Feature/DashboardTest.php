<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('dashboard page is displayed', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('auth.user')
            ->has('accounts', 3) // Check for 3 accounts (instagram, facebook, tiktok)
            ->has('posts', 2) // Check for 2 mocked posts
            ->has('usage', fn (Assert $page) => $page
                ->where('used', 2)
                ->where('limit', 3)
            )
        );
});

test('unauthenticated users cannot access dashboard', function () {
    $this->get('/dashboard')
        ->assertRedirect('/signin');
});

test('unverified users cannot access dashboard', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertRedirect('/email/verify');
});
