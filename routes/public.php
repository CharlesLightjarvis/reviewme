<?php

use App\Http\Controllers\Public\Projects\CommentController;
use App\Http\Controllers\Public\Projects\ProjectController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home/index')->name('home');

Route::prefix('projects')->name('projects.')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProjectController::class, 'show'])->name('show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::post('projects/{project}/comments', [CommentController::class, 'store'])->name('projects.comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});
