<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('authenticated user can view schedule page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('posts.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Schedule')
        );
});

test('user can schedule a valid post', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('post.jpg');

    $response = $this->actingAs($user)
        ->post(route('posts.store'), [
            'media' => $file,
            'caption' => 'This is a test post',
            'platforms' => ['instagram', 'facebook'],
            'scheduled_at' => now()->addDay()->toDateTimeString(),
        ]);

    $response->assertRedirect(route('dashboard'));
    $response->assertSessionHas('success', 'Post scheduled successfully!');
});

test('validation fails for invalid input', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('posts.store'), [
            'media' => null, // Required
            'platforms' => [], // Required
            'scheduled_at' => now()->subDay()->toDateTimeString(), // Must be future
        ]);

    $response->assertSessionHasErrors(['media', 'platforms', 'scheduled_at']);
});
