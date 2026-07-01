import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { index as notificationsIndex } from '@/actions/App/Http/Controllers/NotificationController';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLiveNotifications } from '@/hooks/use-live-notifications';
import type { NotificationItem } from '@/hooks/use-live-notifications';
import { useNotificationsStore } from '@/hooks/use-notifications-store';
import { formatRelativeDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';

type Notifications = {
    unreadCount: number;
    items: NotificationItem[];
};

export function NotificationBell() {
    const { notifications, auth } = usePage<{
        notifications: Notifications | null;
        auth: { user: { id: number } | null };
    }>().props;

    if (!notifications || !auth.user) {
        return null;
    }

    return (
        <NotificationBellContent
            initial={notifications}
            userId={auth.user.id}
        />
    );
}

function NotificationBellContent({
    initial,
    userId,
}: {
    initial: Notifications;
    userId: number;
}) {
    const { unreadCount, readAt, markAsRead, markAllAsRead, registerArrival } =
        useNotificationsStore();
    const [items] = useLiveNotifications(userId, initial.items, {
        limit: 5,
        onArrive: registerArrival,
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-10 rounded-full"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80" align="end">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-xs text-primary hover:underline"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                <DropdownMenuSeparator />

                {items.length > 0 ? (
                    items.map((item) => (
                        <DropdownMenuItem
                            key={item.id}
                            onSelect={(e) => {
                                e.preventDefault();
                                markAsRead(item);
                            }}
                            className={cn(
                                'flex flex-col items-start gap-0.5 whitespace-normal',
                                !readAt(item) &&
                                    'bg-blue-50 focus:bg-blue-100 dark:bg-blue-950/40 dark:focus:bg-blue-950/60',
                            )}
                        >
                            <p className="text-sm text-foreground">
                                {item.data.message}
                            </p>
                            <span className="text-[11px] text-foreground/40">
                                {formatRelativeDate(item.created_at)}
                            </span>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <p className="px-2 py-4 text-center text-sm text-foreground/40">
                        Aucune notification.
                    </p>
                )}

                <DropdownMenuSeparator />

                <Link
                    href={notificationsIndex.url()}
                    className="block px-2 py-1.5 text-center text-xs text-foreground/60 hover:text-foreground"
                >
                    Voir toutes les notifications
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
