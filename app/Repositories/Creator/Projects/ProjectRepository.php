<?php

namespace App\Repositories\Creator\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepository
{
    public function find(int $id): Project;

    public function findBySlug(string $slug): Project;

    public function forUser(int $userId): Collection;

    public function create(array $data): Project;

    public function update(Project $project, array $data): Project;

    public function delete(Project $project): void;
}
