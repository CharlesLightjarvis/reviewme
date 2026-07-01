<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\ProjectStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Projects\ProjectResource;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $counts = Project::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentCreators = User::query()
            ->role('creator')
            ->withCount('projects')
            ->latest()
            ->take(5)
            ->get();

        $recentProjects = Project::query()
            ->where('status', ProjectStatusEnum::Submitted)
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total' => (int) $counts->sum(),
                'submitted' => (int) ($counts[ProjectStatusEnum::Submitted->value] ?? 0),
                'scheduled' => (int) ($counts[ProjectStatusEnum::Scheduled->value] ?? 0),
                'reviewed' => (int) ($counts[ProjectStatusEnum::ReviewedLive->value] ?? 0),
                'creators' => User::query()->role('creator')->count(),
                'newCreatorsThisWeek' => User::query()
                    ->role('creator')
                    ->where('created_at', '>=', now()->startOfWeek())
                    ->count(),
            ],
            'recentCreators' => $recentCreators,
            'recentProjects' => $recentProjects->map(fn (Project $project) => ProjectResource::make($project)->resolve()),
        ]);
    }
}
