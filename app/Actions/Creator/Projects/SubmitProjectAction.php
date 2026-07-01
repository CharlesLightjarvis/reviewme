<?php

namespace App\Actions\Creator\Projects;

use App\Enums\ProjectStatusEnum;
use App\Models\Project;
use App\Repositories\Creator\Projects\ProjectRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class SubmitProjectAction
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly UploadProjectImageAction $uploadImage,
    ) {}

    public function handle(int $userId, array $data): Project
    {
        return DB::transaction(function () use ($userId, $data) {
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image']);
            }

            return $this->repository->create([
                ...$data,
                'user_id' => $userId,
                'status' => ProjectStatusEnum::Submitted->value,
            ]);
        });
    }
}
