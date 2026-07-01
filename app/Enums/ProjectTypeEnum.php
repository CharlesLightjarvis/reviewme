<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectTypeEnum: string
{
    case Web = 'web';
    case Mobile = 'mobile';
    case Design = 'design';
    case NoCode = 'no_code';
    case Backend = 'backend';
    case Tool = 'tool';

    public function label(): string
    {
        return match ($this) {
            self::Web => 'Application Web',
            self::Mobile => 'Application Mobile',
            self::Design => 'Design UI/UX',
            self::NoCode => 'No-Code / Low-Code',
            self::Backend => 'API / Backend',
            self::Tool => 'Outil / Extension',
        };
    }
}
