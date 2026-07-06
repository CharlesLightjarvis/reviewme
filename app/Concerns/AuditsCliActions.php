<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use Illuminate\Support\Facades\Log;

trait AuditsCliActions
{
    /**
     * Écrit une entrée dans le canal d'audit, avec le contexte disponible
     * sur qui a lancé la commande (utilisateur système, IP SSH si disponible).
     *
     * @param  array<string, mixed>  $context
     */
    protected function auditLog(string $event, array $context = []): void
    {
        Log::channel('audit')->info($event, array_merge([
            'system_user' => $this->currentSystemUser(),
            'ssh_client' => $this->currentSshClient(),
            'pid' => getmypid(),
        ], $context));
    }

    private function currentSystemUser(): string
    {
        if (function_exists('posix_getpwuid') && function_exists('posix_geteuid')) {
            $info = posix_getpwuid(posix_geteuid());

            if ($info !== false) {
                return $info['name'];
            }
        }

        return (string) (getenv('USER') ?: getenv('LOGNAME') ?: 'inconnu');
    }

    private function currentSshClient(): ?string
    {
        // SSH_CLIENT / SSH_CONNECTION contiennent l'IP de la machine qui s'est connectée en SSH.
        // Absent si l'accès se fait via `docker exec` direct plutôt que SSH.
        $raw = getenv('SSH_CLIENT') ?: getenv('SSH_CONNECTION');

        if (! $raw) {
            return null;
        }

        return trim(explode(' ', $raw)[0] ?? '') ?: null;
    }
}
