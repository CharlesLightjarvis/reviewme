<?php

namespace App\Repositories\Creator\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class EloquentProjectRepository implements ProjectRepository
{
    public function find(int $id): Project
    {
        return Project::query()->findOrFail($id);
    }

    public function findBySlug(string $slug): Project
    {
        return Project::query()->where('slug', $slug)->firstOrFail();
    }

    public function forUser(int $userId): Collection
    {
        return Project::query()
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function create(array $data): Project
    {
        return Project::query()->create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }
}
