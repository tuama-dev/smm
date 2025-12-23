<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures authenticated users always have a current team context.
 *
 * If user->current_team_id is null, sets it to their personal team.
 * This prevents null reference errors and ensures team-scoped queries work.
 */
class HandleTeamContext
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->current_team_id) {
            $this->setDefaultTeam($user);
        }

        return $next($request);
    }

    /**
     * Set the user's current team to their personal team.
     */
    protected function setDefaultTeam($user): void
    {
        $personalTeam = $user->personalTeam();

        if ($personalTeam) {
            $user->update(['current_team_id' => $personalTeam->id]);
        }
    }
}
