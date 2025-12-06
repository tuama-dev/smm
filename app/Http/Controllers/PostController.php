<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Posts/Index');
    }

    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    public function scheduled()
    {
        return Inertia::render('Posts/Scheduled');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
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

    public function edit($id)
    {
        // Mock data for editing - in real app, fetch from DB
        $post = [
            'id' => $id,
            'title' => 'Mock Post Title',
            'caption' => 'This is a mock caption for editing.',
            'platforms' => ['instagram'],
            'scheduled_at' => now()->addDays(2)->format('Y-m-d\TH:i'),
        ];
        
        return Inertia::render('Posts/Create', [
            'post' => $post
        ]);
    }

    public function update(Request $request, $id)
    {
        // Mock update logic
        return redirect()->route('posts.index')->with('success', 'Post updated successfully!');
    }

    public function destroy($id)
    {
        // Mock delete logic
        return redirect()->route('posts.index')->with('success', 'Post deleted successfully!');
    }
}
