<?php

declare(strict_types=1);

namespace App\Actions\Public\Projects;

use App\Events\CommentPosted;
use App\Models\Comment;
use App\Models\Project;
use App\Notifications\ProjectCommented;
use App\Repositories\Public\Projects\CommentRepository;

class PostCommentAction
{
    public function __construct(
        private readonly CommentRepository $repository,
    ) {}

    public function handle(Project $project, int $userId, array $data): Comment
    {
        $comment = $this->repository->create([
            ...$data,
            'project_id' => $project->id,
            'user_id' => $userId,
        ]);

        $comment->load('user');
        $comment->setRelation('project', $project);

        broadcast(new CommentPosted($comment))->toOthers();

        if ($project->user_id !== $userId) {
            $project->user->notify(new ProjectCommented($comment));
        }

        return $comment;
    }
}
