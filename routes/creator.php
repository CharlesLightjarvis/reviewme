<?php

use App\Http\Controllers\Creator\DashboardController;
use App\Http\Controllers\Creator\Projects\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:creator'])->prefix('creator')->name('creator.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('projects', ProjectController::class)->names('projects');
});
