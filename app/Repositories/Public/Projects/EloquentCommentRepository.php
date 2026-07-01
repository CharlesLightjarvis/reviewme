<?php

declare(strict_types=1);

namespace App\Repositories\Public\Projects;

use App\Models\Comment;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class EloquentCommentRepository implements CommentRepository
{
    public function threadedForProject(Project $project): Collection
    {
        $comments = $project->comments()->with('user')->oldest()->get();

        return $this->buildTree($comments);
    }

    public function create(array $data): Comment
    {
        return Comment::create($data);
    }

    public function update(Comment $comment, array $data): Comment
    {
        $comment->update($data);

        return $comment;
    }

    public function delete(Comment $comment): void
    {
        $comment->delete();
    }

    /**
     * @param  Collection<int, Comment>  $comments
     * @return Collection<int, Comment>
     */
    private function buildTree(Collection $comments, ?int $parentId = null): Collection
    {
        return $comments
            ->where('parent_id', $parentId)
            ->map(function (Comment $comment) use ($comments) {
                $comment->setRelation('replies', $this->buildTree($comments, $comment->id));

                return $comment;
            })
            ->values();
    }
}
