<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectStatusEnum: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Scheduled = 'scheduled';
    case ReviewedLive = 'reviewed_live';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::Submitted => 'Soumis',
            self::Scheduled => 'Programmé',
            self::ReviewedLive => 'Revu en live',
        };
    }
}
