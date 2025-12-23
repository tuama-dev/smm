<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Jobs\PublishPostJob;
use App\Models\Media;
use App\Models\Post;
use App\Services\MediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        protected MediaService $mediaService
    ) {}

    /**
     * Display a listing of posts.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $team = $user->currentTeam;

        if (! $team) {
            abort(404, 'No team selected.');
        }

        $posts = Post::where('team_id', $team->id)
            ->with(['media', 'creator'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Post $post) {
                return [
                    'id' => $post->id,
                    'caption' => $post->caption,
                    'status' => $post->status,
                    'scheduled_at' => $post->scheduled_at?->toISOString(),
                    'created_at' => $post->created_at->toISOString(),
                    'media' => $post->media->map(fn ($m) => [
                        'id' => $m->id,
                        'url' => asset('storage/'.$m->file_path),
                        'file_type' => $m->file_type,
                    ]),
                    'creator' => [
                        'id' => $post->creator->id,
                        'name' => $post->creator->name,
                    ],
                ];
            });

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        $team = $user->currentTeam;

        if (! $team) {
            abort(404, 'No team selected.');
        }

        // Get team's media for selection
        $media = Media::where('team_id', $team->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Media $item) => [
                'id' => $item->id,
                'url' => asset('storage/'.$item->file_path),
                'file_type' => $item->file_type,
                'size_kb' => $item->size_kb,
            ]);

        return Inertia::render('Posts/Create', [
            'media' => $media,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $user = $request->user();
        $team = $user->currentTeam;

        // Create the post
        $post = Post::create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'caption' => $request->input('caption'),
            'post_type' => 'standard',
            'scheduled_at' => $request->input('scheduled_at'),
            'status' => $request->input('status'),
        ]);

        // Attach media if provided
        $mediaIds = $request->input('media_ids', []);
        if (! empty($mediaIds)) {
            // Attach with order
            $attachData = [];
            foreach ($mediaIds as $index => $mediaId) {
                $attachData[$mediaId] = ['order' => $index];
            }
            $post->media()->attach($attachData);
        }

        // If scheduled, dispatch the publish job
        if ($post->status === 'scheduled' && $post->scheduled_at) {
            PublishPostJob::dispatch($post)->delay($post->scheduled_at);
        }

        return redirect()->route('posts.index')
            ->with('success', $post->status === 'draft' ? 'Draft saved!' : 'Post scheduled!');
    }
}
