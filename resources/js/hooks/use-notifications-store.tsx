import { usePage, useHttp } from '@inertiajs/react';
import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
    markAllAsRead as markAllAsReadAction,
    markAsRead as markAsReadAction,
    markAsUnread as markAsUnreadAction,
} from '@/actions/App/Http/Controllers/NotificationController';
import type { NotificationItem } from '@/hooks/use-live-notifications';

type ReadOverrides = Record<string, string | null>;

type NotificationsStoreValue = {
    unreadCount: number;
    readAt: (item: NotificationItem) => string | null;
    markAsRead: (item: NotificationItem) => void;
    markAsUnread: (item: NotificationItem) => void;
    markAllAsRead: () => void;
    registerArrival: () => void;
};

const NotificationsStoreContext = createContext<NotificationsStoreValue | null>(
    null,
);

/**
 * Source unique de vérité pour le statut lu/non-lu des notifications,
 * partagée entre la cloche (header) et la page /notifications. Sans ça,
 * chaque composant garde son propre état local et ils se désynchronisent
 * (ex: la cloche affiche encore "non lu" après un marquage fait sur la page).
 */
export function NotificationsStoreProvider({
    children,
}: {
    children: ReactNode;
}) {
    const { notifications } = usePage<{
        notifications: { unreadCount: number } | null;
    }>().props;
    const serverUnreadCount = notifications?.unreadCount ?? 0;

    const [unreadCount, setUnreadCount] = useState(serverUnreadCount);
    const [overrides, setOverrides] = useState<ReadOverrides>({});
    const [allReadAt, setAllReadAt] = useState<string | null>(null);
    const { patch } = useHttp({});

    // Ce provider persiste entre les navigations Inertia (layout partagé),
    // donc on re-synchronise avec la valeur serveur dès qu'elle change plutôt
    // que de garder l'état du tout premier montage.
    const [syncedServerUnreadCount, setSyncedServerUnreadCount] =
        useState(serverUnreadCount);

    if (serverUnreadCount !== syncedServerUnreadCount) {
        setSyncedServerUnreadCount(serverUnreadCount);
        setUnreadCount(serverUnreadCount);
        setOverrides({});
        setAllReadAt(null);
    }

    const readAt = useCallback(
        (item: NotificationItem): string | null => {
            if (item.id in overrides) {
                return overrides[item.id];
            }

            if (allReadAt && item.created_at <= allReadAt) {
                return allReadAt;
            }

            return item.read_at;
        },
        [overrides, allReadAt],
    );

    const markAsRead = useCallback(
        (item: NotificationItem) => {
            if (readAt(item)) {
                return;
            }

            setOverrides((prev) => ({
                ...prev,
                [item.id]: new Date().toISOString(),
            }));
            setUnreadCount((count) => Math.max(0, count - 1));

            patch(markAsReadAction.url({ notification: item.id }));
        },
        [readAt, patch],
    );

    const markAsUnread = useCallback(
        (item: NotificationItem) => {
            if (!readAt(item)) {
                return;
            }

            setOverrides((prev) => ({ ...prev, [item.id]: null }));
            setUnreadCount((count) => count + 1);

            patch(markAsUnreadAction.url({ notification: item.id }));
        },
        [readAt, patch],
    );

    const markAllAsRead = useCallback(() => {
        setAllReadAt(new Date().toISOString());
        setOverrides({});
        setUnreadCount(0);

        patch(markAllAsReadAction.url());
    }, [patch]);

    const registerArrival = useCallback(() => {
        setUnreadCount((count) => count + 1);
    }, []);

    return (
        <NotificationsStoreContext.Provider
            value={{
                unreadCount,
                readAt,
                markAsRead,
                markAsUnread,
                markAllAsRead,
                registerArrival,
            }}
        >
            {children}
        </NotificationsStoreContext.Provider>
    );
}

export function useNotificationsStore() {
    const context = useContext(NotificationsStoreContext);

    if (!context) {
        throw new Error(
            'useNotificationsStore must be used within a NotificationsStoreProvider',
        );
    }

    return context;
}
