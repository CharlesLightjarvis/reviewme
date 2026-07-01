<?php

namespace App\Http\Requests\Creator\Projects;

use App\Enums\ProjectTypeEnum;
use App\Models\Project;
use App\Rules\GithubUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        $project = $this->route('project');

        if (! $project instanceof Project) {
            return false;
        }

        if ($this->user()?->hasPermissionTo('update.any.project')) {
            return true;
        }

        return $this->user()?->id === $project->user_id
            && $this->user()?->hasPermissionTo('update.own.projects');
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'type' => ['sometimes', Rule::enum(ProjectTypeEnum::class)],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'remove_image' => ['sometimes', 'boolean'],
            'links' => ['sometimes', 'array'],
            'links.github' => ['nullable', 'url', 'max:255', new GithubUrl],
            'links.live' => ['required_with:links', 'url', 'max:255'],
            'tech_stack' => ['sometimes', 'array', 'min:2'],
            'tech_stack.*' => ['string', 'max:50'],
        ];
    }
}
