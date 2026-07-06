<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Concerns\AuditsCliActions;
use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Console\Command;

class PruneCreatorsWithoutProjectsCommand extends Command
{
    use AuditsCliActions;

    protected $signature = 'creators:prune-without-projects';

    protected $description = 'Supprime les comptes créateurs sans projet créé depuis plus de 24h';

    public function handle(): int
    {
        $users = User::role(RoleEnum::Creator->value)
            ->where('created_at', '<=', now()->subDay())
            ->doesntHave('projects')
            ->get();

        if ($users->isEmpty()) {
            $this->info('Aucun compte créateur à supprimer.');

            return self::SUCCESS;
        }

        foreach ($users as $user) {
            $this->auditLog('creator.pruned_without_project', [
                'user_id' => $user->id,
                'email' => $user->email,
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

            $user->delete();
        }

        $this->info("{$users->count()} compte(s) créateur(s) supprimé(s) (sans projet depuis plus de 24h).");

        return self::SUCCESS;
    }
}
