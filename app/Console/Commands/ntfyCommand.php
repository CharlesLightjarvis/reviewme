<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

#[Signature('ntfy')]
#[Description('Notify my phone')]
class NtfyCommand extends Command
{
    public function handle(): int
    {
        $response = Http::withBody(
            'Backup successful 😀',
            'text/plain'
        )->post('https://ntfy.sh/mypersonalalert');

        if ($response->successful()) {
            $this->info('Notification envoyée.');
            return self::SUCCESS;
        }

        $this->error("Erreur ntfy : {$response->status()} {$response->body()}");

        return self::FAILURE;
    }
}
