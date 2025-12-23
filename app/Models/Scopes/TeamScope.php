<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

/**
 * TeamScope filters queries to only return records belonging to the
 * authenticated user's current team. This prevents IDOR vulnerabilities.
 */
class TeamScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check() && Auth::user()->current_team_id) {
            $builder->where($model->getTable().'.team_id', Auth::user()->current_team_id);
        }
    }
}
