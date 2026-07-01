<?php

namespace App\Actions\Creator\Projects;

use App\Models\Project;
use App\Repositories\Creator\Projects\ProjectRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateProjectAction
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly UploadProjectImageAction $uploadImage,
    ) {}

    public function handle(Project $project, array $data): Project
    {
        return DB::transaction(function () use ($project, $data) {
            if (($data['image'] ?? null) instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image'], $project->image);
            } elseif ($data['remove_image'] ?? false) {
                $this->uploadImage->delete($project->image);
                $data['image'] = null;
            } else {
                unset($data['image']);
            }

            unset($data['remove_image']);

            return $this->repository->update($project, $data);
        });
    }
}
