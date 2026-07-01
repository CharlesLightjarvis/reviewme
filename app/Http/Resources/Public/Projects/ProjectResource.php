<?php

declare(strict_types=1);

namespace App\Http\Resources\Public\Projects;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'image' => $this->image ?? '/images/project-placeholder.svg',
            'type' => $this->type->label(),
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->label(),
            'github_url' => $this->links['github'] ?? null,
            'live_url' => $this->links['live'] ?? null,
            'rating' => $this->rating ?? 0,
            'featured' => $this->featured,
            'tech_stack' => $this->tech_stack ?? [],
            'creator' => [
                'id' => $this->user_id,
                'initials' => $this->initials($this->user?->name),
                'name' => $this->user?->name,
            ],
            'is_submitted' => true,
        ];
    }

    private function initials(?string $name): string
    {
        if (! $name) {
            return '';
        }

        return collect(explode(' ', $name))
            ->filter()
            ->take(2)
            ->map(fn (string $part) => Str::upper(Str::substr($part, 0, 1)))
            ->implode('');
    }
}
