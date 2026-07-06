<?php

declare(strict_types=1);

namespace App\Console\Concerns;


use function Laravel\Prompts\error;
use function Laravel\Prompts\password;
use function Laravel\Prompts\warning;

trait RequiresCliSecret
{
    use AuditsCliActions;
    /**
     * Vérifie la phrase secrète CLI_ADMIN_SECRET avant de laisser la commande continuer.
     *
     * Ceci n'est PAS une protection contre un attaquant ayant déjà un accès root/shell complet
     * (il pourrait lire l'env ou modifier le code). C'est une défense en profondeur utile si
     * plusieurs personnes ont un accès SSH limité, ou contre une exécution accidentelle.
     */
    protected function verifyCliSecret(int $maxAttempts = 3): bool
    {
        $expected = config('app.cli_admin_secret');

        if (empty($expected)) {
            warning('Aucune phrase secrète CLI_ADMIN_SECRET n\'est configurée (voir .env). La commande va continuer sans cette protection supplémentaire.');
            $this->auditLog('cli.secret.not_configured', ['command' => $this->signature ?? static::class]);

            return true;
        }

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $input = password('Phrase secrète CLI requise pour continuer');

            if (hash_equals((string) $expected, (string) $input)) {
                $this->auditLog('cli.secret.verified', ['command' => $this->signature ?? static::class]);

                return true;
            }

            error("Phrase secrète incorrecte (tentative {$attempt}/{$maxAttempts}).");

            $this->auditLog('cli.secret.failed_attempt', [
                'command' => $this->signature ?? static::class,
                'attempt' => $attempt,
            ]);
        }

        error('Nombre maximum de tentatives atteint. Commande annulée.');
        $this->auditLog('cli.secret.locked_out', ['command' => $this->signature ?? static::class]);

        return false;
    }
}
