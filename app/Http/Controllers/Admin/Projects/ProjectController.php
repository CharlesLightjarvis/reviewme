<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Projects;

use App\Actions\Admin\Projects\UpdateProjectStatusAction;
use App\Actions\Creator\Projects\DeleteProjectAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Projects\UpdateProjectStatusRequest;
use App\Http\Resources\Admin\Projects\ProjectResource;
use App\Models\Project;
use App\Repositories\Admin\Projects\ProjectRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly UpdateProjectStatusAction $updateStatusAction,
        private readonly DeleteProjectAction $deleteAction,
    ) {}

    #[Authorize('viewAny', Project::class)]
    public function index(): Response
    {
        return Inertia::render('admin/projects/index', [
            'projects' => $this->repository->paginate(15)->through(
                fn (Project $project) => ProjectResource::make($project)->resolve(),
            ),
        ]);
    }

    #[Authorize('update', 'project')]
    public function update(UpdateProjectStatusRequest $request, Project $project): RedirectResponse
    {
        $this->updateStatusAction->handle($project, $request->validated());

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Projet mis à jour.');
    }

    #[Authorize('delete', 'project')]
    public function destroy(Project $project): RedirectResponse
    {
        $this->deleteAction->handle($project);

        return redirect()
            ->route('admin.projects.index')
            ->with('success', 'Projet supprimé.');
    }
}
