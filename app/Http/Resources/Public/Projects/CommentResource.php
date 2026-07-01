<?php

declare(strict_types=1);

namespace App\Http\Resources\Public\Projects;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin Comment */
class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'body' => $this->body,
            'created_at' => $this->created_at->toISOString(),
            'author' => [
                'id' => $this->user_id,
                'name' => $this->user?->name,
                'initials' => $this->initials($this->user?->name),
            ],
            'replies' => $this->whenLoaded(
                'replies',
                fn () => CommentResource::collection($this->replies)->resolve(),
            ),
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
