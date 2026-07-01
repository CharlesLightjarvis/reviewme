<?php

declare(strict_types=1);

namespace App\Actions\Creator\Projects;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadProjectImageAction
{
    public function handle(UploadedFile $file, ?string $existingUrl = null): string
    {
        if ($existingUrl) {
            $this->delete($existingUrl);
        }

        $path = 'Projo/Images/Projects/'.Str::uuid().'.'.$file->getClientOriginalExtension();

        Storage::disk('imagekit')->put($path, $file->get());

        return rtrim(config('filesystems.disks.imagekit.endpoint_url'), '/').'/'.$path;
    }

    public function delete(?string $url): void
    {
        if (! $url) {
            return;
        }

        $endpointUrl = rtrim(config('filesystems.disks.imagekit.endpoint_url'), '/');
        $path = ltrim(str_replace($endpointUrl.'/', '', $url), '/');

        try {
            Storage::disk('imagekit')->delete($path);
        } catch (\Throwable) {
            // Fichier introuvable sur ImageKit, on continue.
        }
    }
}
