<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('Posts/Schedule');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'media' => ['required', 'file', 'mimes:jpg,jpeg,png,mp4,mov', 'max:51200'], // 50MB max
            'caption' => ['nullable', 'string', 'max:2200'],
            'platforms' => ['required', 'array', 'min:1'],
            'platforms.*' => ['in:instagram,facebook,tiktok'],
            'scheduled_at' => ['required', 'date', 'after:now'],
        ]);

        // Mock saving logic for MVP
        // In reality, we would store the file and create a Post model record

        return redirect()->route('dashboard')->with('success', 'Post scheduled successfully!');
    }
}
