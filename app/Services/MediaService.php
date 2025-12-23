<?php

namespace App\Services;

use App\Models\Media;
use App\Models\Team;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MediaService
{
    /**
     * Check if team has storage quota available for the file.
     */
    public function checkStorageQuota(Team $team, int $fileSizeBytes): bool
    {
        $fileSizeKb = (int) ceil($fileSizeBytes / 1024);
        $currentUsed = $team->storage_used_kb ?? 0;
        $storageLimit = $this->getTeamStorageLimit($team);

        return ($currentUsed + $fileSizeKb) <= $storageLimit;
    }

    /**
     * Get the storage limit for a team based on their plan.
     */
    public function getTeamStorageLimit(Team $team): int
    {
        // Load plan if not already loaded
        $plan = $team->plan;

        if (! $plan) {
            // Default to Free plan limit (50 MB = 51200 KB)
            return 51200;
        }

        return $plan->features['storage_kb'] ?? 51200;
    }

    /**
     * Get storage usage statistics for a team.
     *
     * @return array{used_kb: int, limit_kb: int, percentage: float}
     */
    public function getStorageStats(Team $team): array
    {
        $usedKb = $team->storage_used_kb ?? 0;
        $limitKb = $this->getTeamStorageLimit($team);
        $percentage = $limitKb > 0 ? round(($usedKb / $limitKb) * 100, 1) : 0;

        return [
            'used_kb' => $usedKb,
            'limit_kb' => $limitKb,
            'percentage' => min($percentage, 100),
        ];
    }

    /**
     * Extract metadata from uploaded file.
     *
     * @return array{width: int|null, height: int|null, mime_type: string, size_kb: int, file_type: string}
     */
    public function extractMetadata(UploadedFile $file): array
    {
        $mimeType = $file->getMimeType() ?? 'application/octet-stream';
        $sizeKb = (int) ceil($file->getSize() / 1024);
        $fileType = $this->determineFileType($mimeType);

        $width = null;
        $height = null;

        // Extract dimensions for images using Intervention Image v3
        if ($fileType === 'image') {
            try {
                $manager = new \Intervention\Image\ImageManager(
                    new \Intervention\Image\Drivers\Gd\Driver
                );
                $image = $manager->read($file->getPathname());
                $width = $image->width();
                $height = $image->height();
            } catch (\Exception $e) {
                // Fallback to native PHP if Intervention fails
                $dimensions = @getimagesize($file->getPathname());
                if ($dimensions !== false) {
                    $width = $dimensions[0];
                    $height = $dimensions[1];
                }
            }
        }

        // Videos: dimensions would need ffprobe (not handling here)

        return [
            'width' => $width,
            'height' => $height,
            'mime_type' => $mimeType,
            'size_kb' => $sizeKb,
            'file_type' => $fileType,
        ];
    }

    /**
     * Determine file type from mime type.
     */
    protected function determineFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        return 'other';
    }

    /**
     * Generate storage path for team's media.
     */
    public function generateStoragePath(Team $team): string
    {
        return "teams/{$team->id}";
    }

    /**
     * Store the uploaded file and create media record.
     */
    public function store(Team $team, UploadedFile $file): Media
    {
        $metadata = $this->extractMetadata($file);
        $storagePath = $this->generateStoragePath($team);

        // Generate unique filename
        $filename = $file->hashName();

        // Store file in public disk
        $filePath = $file->storeAs($storagePath, $filename, 'public');

        // Create media record
        $media = Media::create([
            'team_id' => $team->id,
            'file_path' => $filePath,
            'file_type' => $metadata['file_type'],
            'mime_type' => $metadata['mime_type'],
            'width' => $metadata['width'],
            'height' => $metadata['height'],
            'size_kb' => $metadata['size_kb'],
        ]);

        // Update team storage usage
        $this->updateTeamStorageUsed($team, $metadata['size_kb']);

        return $media;
    }

    /**
     * Delete media and reclaim storage.
     */
    public function delete(Media $media): bool
    {
        $sizeKb = $media->size_kb;
        $team = $media->team;

        // Delete file from storage
        if ($media->file_path) {
            Storage::disk('public')->delete($media->file_path);
        }

        // Delete record
        $media->delete();

        // Reclaim storage
        $this->updateTeamStorageUsed($team, -$sizeKb);

        return true;
    }

    /**
     * Update team's storage usage.
     */
    public function updateTeamStorageUsed(Team $team, int $deltaKb): void
    {
        $newUsage = max(0, ($team->storage_used_kb ?? 0) + $deltaKb);
        $team->update(['storage_used_kb' => $newUsage]);
    }
}
