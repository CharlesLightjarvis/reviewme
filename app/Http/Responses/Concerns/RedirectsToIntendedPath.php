<?php

declare(strict_types=1);

namespace App\Http\Responses\Concerns;

trait RedirectsToIntendedPath
{
    /**
     * Only trust a local, relative path (e.g. "/projects/foo") to guard against open redirects.
     */
    private function safeIntendedPath(?string $path): ?string
    {
        if (! $path || ! str_starts_with($path, '/') || str_starts_with($path, '//')) {
            return null;
        }

        return $path;
    }
}
