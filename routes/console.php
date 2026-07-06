<?php

use App\Console\Commands\PruneCreatorsWithoutProjectsCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Local : toutes les minutes pour valider rapidement le comportement.
Schedule::command(PruneCreatorsWithoutProjectsCommand::class)
    ->everyMinute()
    ->environments(['local']);

// Prod : une fois par jour à minuit.
Schedule::command(PruneCreatorsWithoutProjectsCommand::class)
    ->dailyAt('00:00')
    ->environments(['production']);
