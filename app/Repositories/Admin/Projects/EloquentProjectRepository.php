<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Projects;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentProjectRepository implements ProjectRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Project::query()
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }
}
