<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CurrentTeamController extends Controller
{
    /**
     * Update the user's current team.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'team_id' => [
                'required',
                'ulid',
                Rule::exists('team_user', 'team_id')->where('user_id', $request->user()->id),
            ],
        ]);

        $request->user()->update([
            'current_team_id' => $validated['team_id'],
        ]);

        return back()->with('success', 'Team switched successfully.');
    }
}
