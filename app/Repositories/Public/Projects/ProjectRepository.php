<?php

declare(strict_types=1);

namespace App\Repositories\Public\Projects;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepository
{
    public function allPublic(): Collection;

    public function findPublicBySlug(string $slug): Project;
}
