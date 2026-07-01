<?php

namespace App\Http\Controllers\Creator\Projects;

use App\Actions\Creator\Projects\DeleteProjectAction;
use App\Actions\Creator\Projects\SubmitProjectAction;
use App\Actions\Creator\Projects\UpdateProjectAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Creator\Projects\StoreProjectRequest;
use App\Http\Requests\Creator\Projects\UpdateProjectRequest;
use App\Http\Resources\Creator\Projects\ProjectResource;
use App\Http\Resources\Public\Projects\CommentResource;
use App\Models\Project;
use App\Repositories\Creator\Projects\ProjectRepository;
use App\Repositories\Public\Projects\CommentRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly CommentRepository $commentRepository,
        private readonly SubmitProjectAction $submitAction,
        private readonly UpdateProjectAction $updateAction,
        private readonly DeleteProjectAction $deleteAction,
    ) {}

    public function index(): Response
    {
        $projects = $this->repository->forUser(Auth::id());

        return Inertia::render('creator/projects/index', [
            'projects' => $projects->map(fn (Project $project) => ProjectResource::make($project)->resolve()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('creator/projects/create');
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->submitAction->handle(
            Auth::id(),
            $request->validated(),
        );

        return redirect()
            ->route('creator.projects.index')
            ->with('success', 'Projet soumis avec succès.');
    }

    #[Authorize('view', 'project')]
    public function show(Project $project): Response
    {
        return Inertia::render('creator/projects/show', [
            'project' => ProjectResource::make($project)->resolve(),
            'comments' => CommentResource::collection(
                $this->commentRepository->threadedForProject($project),
            )->resolve(),
        ]);
    }

    #[Authorize('update', 'project')]
    public function edit(Project $project): Response
    {
        return Inertia::render('creator/projects/edit', [
            'project' => ProjectResource::make($project)->resolve(),
        ]);
    }

    #[Authorize('update', 'project')]
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->updateAction->handle($project, $request->validated());

        return redirect()
            ->route('creator.projects.index')
            ->with('success', 'Projet mis à jour.');
    }

    #[Authorize('delete', 'project')]
    public function destroy(Project $project): RedirectResponse
    {
        $this->deleteAction->handle($project);

        return redirect()
            ->route('creator.projects.index')
            ->with('success', 'Projet supprimé.');
    }
}
