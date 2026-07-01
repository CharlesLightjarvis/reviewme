<?php

namespace App\Actions\Creator\Projects;

use App\Models\Project;
use App\Repositories\Creator\Projects\ProjectRepository;
use Illuminate\Support\Facades\DB;

class DeleteProjectAction
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly UploadProjectImageAction $uploadImage,
    ) {}

    public function handle(Project $project): void
    {
        DB::transaction(function () use ($project) {
            $this->uploadImage->delete($project->image);

            $this->repository->delete($project);
        });
    }
}
