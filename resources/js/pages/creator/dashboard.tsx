import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Eye, FolderOpen, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { show } from '@/actions/App/Http/Controllers/Creator/Projects/ProjectController';
import { statusColors, type Project } from './projects/shared';

type Stats = {
    total: number;
    submitted: number;
    scheduled: number;
    reviewed: number;
};

type PageProps = {
    auth: { user: { name: string } };
    stats?: Stats;
    recentProjects?: Project[];
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function CreatorDashboard() {
    const { auth, stats, recentProjects = [] } = usePage<PageProps>().props;

    const cards = [
        { label: 'Projets soumis', value: stats?.total ?? 0, icon: FolderOpen, color: 'text-blue-400' },
        { label: 'En attente de revue', value: stats?.submitted ?? 0, icon: Clock, color: 'text-amber-400' },
        { label: 'Programmés', value: stats?.scheduled ?? 0, icon: Star, color: 'text-purple-400' },
        { label: 'Revus en live', value: stats?.reviewed ?? 0, icon: Eye, color: 'text-emerald-400' },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                Espace Creator
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                                Bonjour, {auth.user.name} 👋
                            </h1>
                            <p className="mt-1 text-sm text-foreground/50">
                                Soumets ton projet et fais-le revoir en live sur TikTok.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/creator/projects/create" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Soumettre un projet
                            </Link>
                        </Button>
                    </div>

                    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {cards.map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="flex w-full flex-col"
                            >
                                <Card className="flex-1 border-border/40 bg-background/60 backdrop-blur-sm">
                                    <CardContent className="flex h-full flex-col p-5">
                                        <div className="flex items-center gap-2">
                                            <card.icon className={`h-4 w-4 ${card.color}`} />
                                            <span className="text-xs font-medium text-foreground/50">{card.label}</span>
                                        </div>
                                        <p className="mt-auto pt-4 text-3xl font-bold text-foreground">{card.value}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mb-10">
                        <h2 className="mb-3 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                            5 derniers projets soumis
                        </h2>

                        <Card className="w-full min-w-0 border-border/40">
                            <CardContent className="p-0">
                                {recentProjects.length > 0 ? (
                                    <ul className="divide-y divide-border/40">
                                        {recentProjects.map((project) => (
                                            <li key={project.id}>
                                                <Link
                                                    href={show.url({
                                                        project: project.slug,
                                                    })}
                                                    className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
                                                >
                                                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                                                        <img
                                                            src={
                                                                project.image ??
                                                                '/images/project-placeholder.svg'
                                                            }
                                                            alt={project.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {project.title}
                                                        </p>
                                                        <span
                                                            className={`mt-0.5 inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold ${statusColors[project.status] ?? 'border-border/30 bg-foreground/5 text-foreground/50'}`}
                                                        >
                                                            {
                                                                project.status_label
                                                            }
                                                        </span>
                                                    </div>

                                                    <span className="shrink-0 text-xs text-foreground/40">
                                                        {formatDate(
                                                            project.created_at,
                                                        )}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-8 text-center text-sm text-foreground/40">
                                        Aucun projet soumis pour le moment.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {(!stats || stats.total === 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/40 py-20 text-center"
                        >
                            <FolderOpen className="mb-4 h-10 w-10 text-foreground/20" />
                            <p className="mb-1 font-medium text-foreground/60">Aucun projet soumis</p>
                            <p className="mb-6 text-sm text-foreground/40">
                                Soumets ton premier projet pour qu'il soit revu en live.
                            </p>
                            <Button asChild>
                                <Link href="/creator/projects/create" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Soumettre un projet
                                </Link>
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </>
    );
}
