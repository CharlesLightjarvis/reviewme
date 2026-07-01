<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Projects;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\Projects\CommentResource;
use App\Http\Resources\Public\Projects\ProjectResource;
use App\Models\Project;
use App\Repositories\Public\Projects\CommentRepository;
use App\Repositories\Public\Projects\ProjectRepository;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly CommentRepository $commentRepository,
    ) {}

    public function index(): Response
    {
        $projects = $this->repository->allPublic();

        $resolved = $projects->map(fn (Project $project) => ProjectResource::make($project)->resolve());

        return Inertia::render('home/projects/index', [
            'projects' => $resolved,
            'types' => $resolved->pluck('type')->unique()->values(),
            'creators' => $resolved->pluck('creator.name')->filter()->unique()->values(),
        ]);
    }

    public function show(string $slug): Response
    {
        $project = $this->repository->findPublicBySlug($slug);

        return Inertia::render('home/projects/show', [
            'project' => ProjectResource::make($project)->resolve(),
            'comments' => CommentResource::collection(
                $this->commentRepository->threadedForProject($project),
            )->resolve(),
        ]);
    }
}
