<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar_url' => $request->user()->avatar_url,
                    'current_team_id' => $request->user()->current_team_id,
                ] : null,

                'currentTeam' => $request->user()?->currentTeam ? [
                    'id' => $request->user()->currentTeam->id,
                    'name' => $request->user()->currentTeam->name,
                    'slug' => $request->user()->currentTeam->slug,
                    'personal_team' => $request->user()->currentTeam->personal_team,
                ] : null,

                'allTeams' => $request->user() ? $request->user()->teams()->get()->map(fn ($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                    'slug' => $team->slug,
                    'personal_team' => $team->personal_team,
                ])->toArray() : [],
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
