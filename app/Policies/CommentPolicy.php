<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id
            && $user->hasPermissionTo(PermissionEnum::UpdateOwnComments->value);
    }

    public function delete(User $user, Comment $comment): bool
    {
        if ($user->hasPermissionTo(PermissionEnum::DeleteAnyComment->value)) {
            return true;
        }

        if ($user->id === $comment->user_id
            && $user->hasPermissionTo(PermissionEnum::DeleteOwnComments->value)) {
            return true;
        }

        return $user->id === $comment->project->user_id
            && $user->hasPermissionTo(PermissionEnum::ModerateOwnProjectComments->value);
    }
}
