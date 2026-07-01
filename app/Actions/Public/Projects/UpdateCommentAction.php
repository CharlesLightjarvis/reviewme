<?php

declare(strict_types=1);

namespace App\Actions\Public\Projects;

use App\Models\Comment;
use App\Repositories\Public\Projects\CommentRepository;

class UpdateCommentAction
{
    public function __construct(
        private readonly CommentRepository $repository,
    ) {}

    public function handle(Comment $comment, array $data): Comment
    {
        return $this->repository->update($comment, $data);
    }
}
