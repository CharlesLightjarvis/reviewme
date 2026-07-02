<?php

namespace App\Actions\Creator\Projects;

use App\Enums\ProjectStatusEnum;
use App\Enums\RoleEnum;
use App\Models\Project;
use App\Models\User;
use App\Notifications\ProjectSubmitted;
use App\Repositories\Creator\Projects\ProjectRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class SubmitProjectAction
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly UploadProjectImageAction $uploadImage,
    ) {}

    public function handle(int $userId, array $data): Project
    {
        $project = DB::transaction(function () use ($userId, $data) {
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image']);
            }

            return $this->repository->create([
                ...$data,
                'user_id' => $userId,
                'status' => ProjectStatusEnum::Submitted->value,
            ]);
        });

        $project->load('user');

        Notification::send(
            User::role(RoleEnum::Admin->value)->get(),
            new ProjectSubmitted($project),
        );

        return $project;
    }
}
