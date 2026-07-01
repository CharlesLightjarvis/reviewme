<?php

declare(strict_types=1);

namespace App\Repositories\Public\Projects;

use App\Models\Comment;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface CommentRepository
{
    public function threadedForProject(Project $project): Collection;

    public function create(array $data): Comment;

    public function update(Comment $comment, array $data): Comment;

    public function delete(Comment $comment): void;
}
