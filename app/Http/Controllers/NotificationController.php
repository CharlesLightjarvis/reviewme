<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    public function index(): InertiaResponse
    {
        return Inertia::render('notifications/index', [
            'notificationsList' => Auth::user()
                ->notifications()
                ->latest()
                ->paginate(10),
        ]);
    }

    public function markAsRead(string $notification): Response
    {
        Auth::user()
            ?->notifications()
            ->where('id', $notification)
            ->first()
            ?->markAsRead();

        return response()->noContent();
    }

    public function markAsUnread(string $notification): Response
    {
        Auth::user()
            ?->notifications()
            ->where('id', $notification)
            ->first()
            ?->markAsUnread();

        return response()->noContent();
    }

    public function markAllAsRead(): Response
    {
        Auth::user()?->unreadNotifications->markAsRead();

        return response()->noContent();
    }
}
