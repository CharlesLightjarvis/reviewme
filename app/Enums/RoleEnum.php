<?php

declare(strict_types=1);

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'admin';
    case Creator = 'creator';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Creator => 'Créateur',
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::Admin => PermissionEnum::cases(),

            self::Creator => [
                PermissionEnum::SubmitProjects,
                PermissionEnum::ViewOwnProjects,
                PermissionEnum::UpdateOwnProjects,
                PermissionEnum::DeleteOwnProjects,
                PermissionEnum::CreateComments,
                PermissionEnum::UpdateOwnComments,
                PermissionEnum::DeleteOwnComments,
                PermissionEnum::ModerateOwnProjectComments,
            ],
        };
    }
}
