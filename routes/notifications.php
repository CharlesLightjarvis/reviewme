<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::patch('{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::patch('{notification}/unread', [NotificationController::class, 'markAsUnread'])->name('unread');
    Route::patch('read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
});
