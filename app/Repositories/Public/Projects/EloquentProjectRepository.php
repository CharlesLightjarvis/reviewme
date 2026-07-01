<?php

declare(strict_types=1);

namespace App\Repositories\Public\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class EloquentProjectRepository implements ProjectRepository
{
    public function allPublic(): Collection
    {
        return Project::query()
            ->publiclyVisible()
            ->with('user')
            ->orderByDesc('featured')
            ->latest()
            ->get();
    }

    public function findPublicBySlug(string $slug): Project
    {
        return Project::query()
            ->publiclyVisible()
            ->with('user')
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
