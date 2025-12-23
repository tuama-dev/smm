<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMediaRequest;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        protected MediaService $mediaService
    ) {}

    /**
     * Display the media library.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $team = $user->currentTeam;

        if (! $team) {
            abort(404, 'No team selected.');
        }

        // Get team's media
        $media = Media::where('team_id', $team->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Media $item) {
                return [
                    'id' => $item->id,
                    'file_path' => $item->file_path,
                    'url' => asset('storage/'.$item->file_path),
                    'file_type' => $item->file_type,
                    'mime_type' => $item->mime_type,
                    'width' => $item->width,
                    'height' => $item->height,
                    'size_kb' => $item->size_kb,
                    'created_at' => $item->created_at->toISOString(),
                ];
            });

        // Get storage stats
        $storageStats = $this->mediaService->getStorageStats($team);

        return Inertia::render('Media/Index', [
            'media' => $media,
            'storageStats' => $storageStats,
        ]);
    }

    /**
     * Store a newly uploaded media file.
     */
    public function store(StoreMediaRequest $request): RedirectResponse
    {
        $user = $request->user();
        $team = $user->currentTeam;
        $file = $request->file('file');

        // Check storage quota
        if (! $this->mediaService->checkStorageQuota($team, $file->getSize())) {
            return back()->with('error', 'Storage limit reached. Please upgrade your plan or delete some files.');
        }

        // Store the file
        $this->mediaService->store($team, $file);

        return back()->with('success', 'File uploaded successfully.');
    }

    /**
     * Delete a media file.
     */
    public function destroy(Request $request, Media $media): RedirectResponse
    {
        $user = $request->user();
        $team = $user->currentTeam;

        // Debug logging
        \Log::info('Media delete attempt', [
            'media_id' => $media->id,
            'media_team_id' => $media->team_id,
            'user_id' => $user->id,
            'current_team_id' => $team?->id,
        ]);

        // Ensure user has a current team
        if (! $team) {
            abort(403, 'No team selected.');
        }

        // Authorization: Ensure media belongs to user's current team
        if ((string) $media->team_id !== (string) $team->id) {
            \Log::warning('Media delete unauthorized', [
                'media_team_id' => $media->team_id,
                'user_team_id' => $team->id,
            ]);
            abort(403, 'Unauthorized access to media.');
        }

        $this->mediaService->delete($media);

        return back()->with('success', 'File deleted successfully.');
    }
}
