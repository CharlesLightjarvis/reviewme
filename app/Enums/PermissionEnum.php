<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionEnum: string
{
    // Creator
    case SubmitProjects = 'submit.projects';
    case ViewOwnProjects = 'view.own.projects';
    case UpdateOwnProjects = 'update.own.projects';
    case DeleteOwnProjects = 'delete.own.projects';

    // Admin
    case ViewAnyProject = 'view.any.project';
    case UpdateAnyProject = 'update.any.project';
    case DeleteAnyProject = 'delete.any.project';
    case ScheduleProjects = 'schedule.projects';
    case ManageUsers = 'manage.users';

    // Comments
    case CreateComments = 'create.comments';
    case UpdateOwnComments = 'update.own.comments';
    case DeleteOwnComments = 'delete.own.comments';
    case ModerateOwnProjectComments = 'moderate.own.project.comments';
    case DeleteAnyComment = 'delete.any.comment';
}
