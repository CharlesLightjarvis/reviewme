<?php

declare(strict_types=1);

namespace App\Http\Controllers\Creator;

use App\Enums\ProjectStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Creator\Projects\ProjectResource;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $counts = Project::query()
            ->where('user_id', Auth::id())
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $recentProjects = Project::query()
            ->where('user_id', Auth::id())
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('creator/dashboard', [
            'stats' => [
                'total' => (int) $counts->sum(),
                'submitted' => (int) ($counts[ProjectStatusEnum::Submitted->value] ?? 0),
                'scheduled' => (int) ($counts[ProjectStatusEnum::Scheduled->value] ?? 0),
                'reviewed' => (int) ($counts[ProjectStatusEnum::ReviewedLive->value] ?? 0),
            ],
            'recentProjects' => $recentProjects->map(fn (Project $project) => ProjectResource::make($project)->resolve()),
        ]);
    }
}
