<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Projects;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function update(Project $project, array $data): Project;
}
