<?php

namespace App\Http\Resources\Creator\Projects;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'image' => $this->image,
            'links' => $this->links,
            'rating' => $this->rating,
            'featured' => $this->featured,
            'tech_stack' => $this->tech_stack,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
