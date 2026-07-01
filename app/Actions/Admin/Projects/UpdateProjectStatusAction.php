<?php

declare(strict_types=1);

namespace App\Actions\Admin\Projects;

use App\Models\Project;
use App\Notifications\ProjectStatusUpdated;
use App\Repositories\Admin\Projects\ProjectRepository;
use Illuminate\Support\Facades\DB;

class UpdateProjectStatusAction
{
    public function __construct(
        private readonly ProjectRepository $repository,
    ) {}

    public function handle(Project $project, array $data): Project
    {
        $previousStatus = $project->status;

        $updated = DB::transaction(function () use ($project, $data) {
            return $this->repository->update($project, $data);
        });

        if (isset($data['status']) && $updated->status !== $previousStatus) {
            $updated->user?->notify(new ProjectStatusUpdated($updated));
        }

        return $updated;
    }
}
