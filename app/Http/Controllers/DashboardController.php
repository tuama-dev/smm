<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'accounts' => [
                'instagram' => [
                    [
                        'id' => 1,
                        'name' => 'Tuama Dev',
                        'avatar' => 'https://ui-avatars.com/api/?name=Tuama+Dev&background=random',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Tuama Lifestyle',
                        'avatar' => 'https://ui-avatars.com/api/?name=Tuama+Life&background=random',
                    ]
                ],
                'facebook' => [],
                'tiktok' => [
                    [
                        'id' => 3,
                        'name' => '@tuamadev',
                        'avatar' => 'https://ui-avatars.com/api/?name=TD&background=000000&color=fff',
                    ]
                ],
            ],
            'posts' => [
                [
                    'id' => 1,
                    'type' => 'image',
                    'platform' => 'instagram',
                    'caption' => 'Exciting news coming soon! 🚀 #LaunchDay',
                    'scheduled_at' => now()->addDays(1)->toIso8601String(),
                    'status' => 'Scheduled',
                ],
                [
                    'id' => 2,
                    'type' => 'video',
                    'platform' => 'tiktok',
                    'caption' => 'Behind the scenes at our office 🎥',
                    'scheduled_at' => now()->addDays(2)->toIso8601String(),
                    'status' => 'Scheduled',
                ],
            ],
            'usage' => [
                'used' => 2,
                'limit' => 3,
            ],
        ]);
    }
}
