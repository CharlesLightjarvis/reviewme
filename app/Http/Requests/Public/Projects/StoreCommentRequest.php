<?php

declare(strict_types=1);

namespace App\Http\Requests\Public\Projects;

use App\Enums\PermissionEnum;
use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo(PermissionEnum::CreateComments->value) ?? false;
    }

    public function rules(): array
    {
        /** @var Project $project */
        $project = $this->route('project');

        return [
            'body' => ['required', 'string', 'max:2000'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('comments', 'id')->where('project_id', $project->id),
            ],
        ];
    }
}
