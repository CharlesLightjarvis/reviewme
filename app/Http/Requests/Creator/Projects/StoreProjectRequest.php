<?php

namespace App\Http\Requests\Creator\Projects;

use App\Enums\ProjectTypeEnum;
use App\Rules\GithubUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermissionTo('submit.projects') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', Rule::enum(ProjectTypeEnum::class)],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'links' => ['required', 'array'],
            'links.github' => ['nullable', 'url', 'max:255', new GithubUrl],
            'links.live' => ['required', 'url', 'max:255'],
            'tech_stack' => ['required', 'array', 'min:2'],
            'tech_stack.*' => ['string', 'max:50'],
        ];
    }
}
