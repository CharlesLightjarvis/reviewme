<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(PermissionEnum::ViewAnyProject->value);
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->hasPermissionTo(PermissionEnum::ViewAnyProject->value)) {
            return true;
        }

        return $user->id === $project->user_id
            && $user->hasPermissionTo(PermissionEnum::ViewOwnProjects->value);
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->hasPermissionTo(PermissionEnum::UpdateAnyProject->value)) {
            return true;
        }

        return $user->id === $project->user_id
            && $user->hasPermissionTo(PermissionEnum::UpdateOwnProjects->value);
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->hasPermissionTo(PermissionEnum::DeleteAnyProject->value)) {
            return true;
        }

        return $user->id === $project->user_id
            && $user->hasPermissionTo(PermissionEnum::DeleteOwnProjects->value);
    }
}
