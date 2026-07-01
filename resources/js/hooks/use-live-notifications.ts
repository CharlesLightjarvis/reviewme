import { useState } from 'react';
import { useEchoNotification } from '@laravel/echo-react';

export type NotificationData = {
    project_slug: string;
    project_title: string;
    status_label: string;
    message: string;
};

export type NotificationItem = {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
};

/** Garde une liste de notifications à jour en temps réel via le canal privé de l'utilisateur. */
export function useLiveNotifications(
    userId: number,
    initialItems: NotificationItem[],
    options?: { limit?: number; onArrive?: () => void },
) {
    const [items, setItems] = useState(initialItems);

    useEchoNotification<NotificationData & { id?: string }>(
        `App.Models.User.${userId}`,
        (notification) => {
            setItems((prev) => {
                const next = [
                    {
                        id: notification.id ?? crypto.randomUUID(),
                        data: notification,
                        read_at: null,
                        created_at: new Date().toISOString(),
                    },
                    ...prev,
                ];

                return options?.limit ? next.slice(0, options.limit) : next;
            });

            options?.onArrive?.();
        },
    );

    return [items, setItems] as const;
}
