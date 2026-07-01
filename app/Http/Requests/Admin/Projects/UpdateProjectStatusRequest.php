<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Projects;

use App\Enums\ProjectStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo('update.any.project') ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(ProjectStatusEnum::class)],
            'featured' => ['sometimes', 'boolean'],
        ];
    }
}
