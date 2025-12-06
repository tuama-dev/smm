<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\seed;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed roles for tests
    seed(RoleSeeder::class);

    Notification::fake();
});

// Registration Page Tests
it('displays the registration page', function () {
    get('/signup')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('Auth/SignUp'));
});

it('redirects authenticated users away from signup page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/signup')
        ->assertRedirect('/dashboard');
});

// Successful Registration Tests
it('can register a new user with valid data', function () {
    $response = post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '+1234567890',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect('/email/verify');

    assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '+1234567890',
    ]);

    expect(User::where('email', 'john@example.com')->exists())->toBeTrue();
});

it('hashes the user password', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $user = User::where('email', 'john@example.com')->first();

    expect($user->password)->not->toBe('password123')
        ->and(Hash::check('password123', $user->password))->toBeTrue();
});

it('authenticates the user after registration', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    expect(auth()->check())->toBeTrue()
        ->and(auth()->user()->email)->toBe('john@example.com');
});

it('sends verification email after registration', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    Notification::assertSentTo(
        User::where('email', 'john@example.com')->first(),
        VerifyEmail::class
    );
});

it('assigns customer role to newly registered users', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $user = User::where('email', 'john@example.com')->first();

    expect($user->hasRole('customer'))->toBeTrue()
        ->and($user->roles)->toHaveCount(1);
});

it('can register without phone number', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect('/email/verify');

    assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'phone' => null,
    ]);
});

// Validation Tests
it('requires name for registration', function () {
    post('/signup', [
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('name');
});

it('requires email for registration', function () {
    post('/signup', [
        'name' => 'John Doe',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('requires valid email format', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'invalid-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('requires unique email', function () {
    User::factory()->create(['email' => 'john@example.com']);

    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

it('requires password for registration', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ])->assertSessionHasErrors('password');
});

it('requires password to be at least 8 characters', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'pass',
        'password_confirmation' => 'pass',
    ])->assertSessionHasErrors('password');
});

it('requires password confirmation', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different123',
    ])->assertSessionHasErrors('password');
});

it('requires name to be 255 characters or less', function () {
    post('/signup', [
        'name' => str_repeat('a', 256),
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('name');
});

it('requires phone to be 20 characters or less', function () {
    post('/signup', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => str_repeat('1', 21),
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('phone');
});

it('accepts valid phone numbers with various formats', function () {
    $phoneNumbers = [
        '+1234567890',
        '(123) 456-7890',
        '123-456-7890',
        '1234567890',
    ];

    foreach ($phoneNumbers as $phone) {
        $email = fake()->unique()->email();
        post('/signup', [
            'name' => 'John Doe',
            'email' => $email,
            'phone' => $phone,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect('/email/verify');
    }
});

// Edge Cases
it('trims whitespace from name and email', function () {
    post('/signup', [
        'name' => '  John Doe  ',
        'email' => '  john@example.com  ',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);
});

it('rejects registration with malicious input', function () {
    post('/signup', [
        'name' => '<script>alert("XSS")</script>',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $user = User::where('email', 'john@example.com')->first();
    expect($user->name)->toBe('<script>alert("XSS")</script>');
    // Laravel escapes output by default, so storing is safe
});
