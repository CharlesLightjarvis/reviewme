<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Projects;

use App\Actions\Public\Projects\DeleteCommentAction;
use App\Actions\Public\Projects\PostCommentAction;
use App\Actions\Public\Projects\UpdateCommentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\Projects\StoreCommentRequest;
use App\Http\Requests\Public\Projects\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Project;
use Illuminate\Http\Response;
use Illuminate\Routing\Attributes\Controllers\Authorize;

class CommentController extends Controller
{
    public function __construct(
        private readonly PostCommentAction $postAction,
        private readonly UpdateCommentAction $updateAction,
        private readonly DeleteCommentAction $deleteAction,
    ) {}

    public function store(StoreCommentRequest $request, Project $project): Response
    {
        $this->postAction->handle(
            $project,
            $request->user()->id,
            $request->validated(),
        );

        return response()->noContent();
    }

    public function update(UpdateCommentRequest $request, Comment $comment): Response
    {
        $this->updateAction->handle($comment, $request->validated());

        return response()->noContent();
    }

    #[Authorize('delete', 'comment')]
    public function destroy(Comment $comment): Response
    {
        $this->deleteAction->handle($comment);

        return response()->noContent();
    }
}
