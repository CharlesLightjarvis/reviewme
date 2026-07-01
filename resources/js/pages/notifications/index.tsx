import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, Circle, CircleCheck } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from '@/components/ui/pagination';
import { useLiveNotifications } from '@/hooks/use-live-notifications';
import type { NotificationItem } from '@/hooks/use-live-notifications';
import { useNotificationsStore } from '@/hooks/use-notifications-store';
import { formatRelativeDate } from '@/lib/format-date';
import { cn } from '@/lib/utils';

type PageLink = { url: string | null; label: string; active: boolean };

type Paginated<T> = {
    data: T[];
    links: PageLink[];
    total: number;
};

type PageProps = {
    notificationsList: Paginated<NotificationItem>;
    auth: { user: { id: number } };
};

function pageLinkLabel(text: string): string {
    return text.replace('&laquo; Previous', '←').replace('Next &raquo;', '→');
}

export default function NotificationsIndex() {
    const { notificationsList, auth } = usePage<PageProps>().props;
    const { unreadCount, readAt, markAsRead, markAsUnread, markAllAsRead } =
        useNotificationsStore();
    const [items] = useLiveNotifications(auth.user.id, notificationsList.data);

    const handleToggleRead = (item: NotificationItem) => {
        if (readAt(item)) {
            markAsUnread(item);
        } else {
            markAsRead(item);
        }
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="w-full space-y-6 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground md:text-3xl">
                            <Bell className="h-6 w-6" />
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-foreground/50">
                            {notificationsList.total} notification
                            {notificationsList.total > 1 ? 's' : ''} au total.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            Tout marquer comme lu
                        </Button>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card className="w-full min-w-0 border-border/40">
                        <CardContent className="p-0">
                            {items.length > 0 ? (
                                <ul className="divide-y divide-border/40">
                                    {items.map((item) => (
                                        <li
                                            key={item.id}
                                            className={cn(
                                                'flex items-center justify-between gap-4 p-4',
                                                !readAt(item) &&
                                                    'bg-blue-50 dark:bg-blue-950/40',
                                            )}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-foreground">
                                                    {item.data.message}
                                                </p>
                                                <span className="text-xs text-foreground/40">
                                                    {formatRelativeDate(
                                                        item.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            <Button
                                                variant={
                                                    readAt(item)
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="shrink-0 gap-1.5"
                                                onClick={() =>
                                                    handleToggleRead(item)
                                                }
                                            >
                                                {readAt(item) ? (
                                                    <>
                                                        <Circle className="h-3.5 w-3.5" />
                                                        Marquer non lu
                                                    </>
                                                ) : (
                                                    <>
                                                        <CircleCheck className="h-3.5 w-3.5" />
                                                        Marquer lu
                                                    </>
                                                )}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="p-8 text-center text-sm text-foreground/40">
                                    Aucune notification pour le moment.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {notificationsList.links.length > 3 && (
                    <Pagination>
                        <PaginationContent>
                            {notificationsList.links.map((link, i) =>
                                link.label.includes('...') ? (
                                    <PaginationItem key={i}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                className={cn(
                                                    buttonVariants({
                                                        variant: link.active
                                                            ? 'outline'
                                                            : 'ghost',
                                                        size: 'icon',
                                                    }),
                                                )}
                                            >
                                                {pageLinkLabel(link.label)}
                                            </Link>
                                        ) : (
                                            <span
                                                className={cn(
                                                    buttonVariants({
                                                        variant: 'ghost',
                                                        size: 'icon',
                                                    }),
                                                    'pointer-events-none opacity-40',
                                                )}
                                            >
                                                {pageLinkLabel(link.label)}
                                            </span>
                                        )}
                                    </PaginationItem>
                                ),
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </>
    );
}
