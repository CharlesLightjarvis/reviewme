import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FolderOpen, Star, UserPlus, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tab';
import { useInitials } from '@/hooks/use-initials';
import { index as projectsIndex } from '@/actions/App/Http/Controllers/Admin/Projects/ProjectController';
import { ProjectRow, type AdminProject } from './projects/project-row';

type Stats = {
    total: number;
    submitted: number;
    scheduled: number;
    reviewed: number;
    creators: number;
    newCreatorsThisWeek: number;
};

type RecentCreator = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    projects_count: number;
};

type PageProps = {
    auth: { user: { name: string } };
    stats: Stats;
    recentCreators: RecentCreator[];
    recentProjects: AdminProject[];
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function StatCard({
    label,
    value,
    icon: Icon,
    color,
    delay,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="flex w-full flex-col"
        >
            <Card className="flex-1 border-border/40 bg-background/60 backdrop-blur-sm">
                <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="text-xs font-medium text-foreground/50">
                            {label}
                        </span>
                    </div>
                    <p className="mt-auto pt-4 text-3xl font-bold text-foreground">
                        {value}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const { auth, stats, recentCreators, recentProjects } =
        usePage<PageProps>().props;
    const getInitials = useInitials();

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                Espace Admin
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                                Bonjour, {auth.user.name} 👋
                            </h1>
                            <p className="mt-1 text-sm text-foreground/50">
                                Vue d'ensemble des projets soumis par les
                                créateurs.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={projectsIndex.url()} className="gap-2">
                                Modérer les projets
                            </Link>
                        </Button>
                    </div>

                    <Tabs defaultValue="users" className="w-full">
                        <Tabs.List>
                            <Tabs.Trigger value="users">
                                Utilisateurs
                            </Tabs.Trigger>
                            <Tabs.Trigger value="projects">
                                Projets
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="users" className="w-full">
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <StatCard
                                    label="Créateurs"
                                    value={stats.creators}
                                    icon={Users}
                                    color="text-sky-400"
                                    delay={0}
                                />
                                <StatCard
                                    label="Nouveaux cette semaine"
                                    value={stats.newCreatorsThisWeek}
                                    icon={UserPlus}
                                    color="text-teal-400"
                                    delay={0.06}
                                />
                            </div>

                            <h2 className="mb-3 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                5 derniers utilisateurs inscrits
                            </h2>

                            <Card className="w-full min-w-0 border-border/40">
                                <CardContent className="p-0">
                                    {recentCreators.length > 0 ? (
                                        <ul className="divide-y divide-border/40">
                                            {recentCreators.map((creator) => (
                                                <li
                                                    key={creator.id}
                                                    className="flex items-center gap-3 p-4"
                                                >
                                                    <Avatar className="h-9 w-9 shrink-0">
                                                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                            {getInitials(
                                                                creator.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {creator.name}
                                                        </p>
                                                        <p className="truncate text-xs text-foreground/50">
                                                            {creator.email}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] text-foreground/50">
                                                        {
                                                            creator.projects_count
                                                        }{' '}
                                                        projet
                                                        {creator.projects_count >
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </span>

                                                    <span className="shrink-0 text-xs text-foreground/40">
                                                        {formatDate(
                                                            creator.created_at,
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="p-8 text-center text-sm text-foreground/40">
                                            Aucun créateur inscrit pour le
                                            moment.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Tabs.Content>

                        <Tabs.Content value="projects" className="w-full">
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                <StatCard
                                    label="Projets au total"
                                    value={stats.total}
                                    icon={FolderOpen}
                                    color="text-blue-400"
                                    delay={0}
                                />
                                <StatCard
                                    label="En attente de revue"
                                    value={stats.submitted}
                                    icon={Clock}
                                    color="text-amber-400"
                                    delay={0.06}
                                />
                                <StatCard
                                    label="Programmés"
                                    value={stats.scheduled}
                                    icon={Calendar}
                                    color="text-purple-400"
                                    delay={0.12}
                                />
                                <StatCard
                                    label="Revus en live"
                                    value={stats.reviewed}
                                    icon={Star}
                                    color="text-emerald-400"
                                    delay={0.18}
                                />
                            </div>

                            <h2 className="mb-3 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                5 derniers projets soumis
                            </h2>

                            <div className="flex w-full flex-col gap-4">
                                {recentProjects.length > 0 ? (
                                    recentProjects.map((project) => (
                                        <ProjectRow
                                            key={project.id}
                                            project={project}
                                        />
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-sm text-foreground/40">
                                        Aucun projet en attente de revue.
                                    </p>
                                )}
                            </div>
                        </Tabs.Content>
                    </Tabs>
                </motion.div>
            </div>
        </>
    );
}
