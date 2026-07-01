import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Github,
    ExternalLink,
    Code2,
    MessageCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectComments } from '@/components/project-comments';
import type { Project } from '@/types';

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'Revu en live':
            'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
        Programmé: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
        Soumis: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    };

    const cls =
        colors[status] ?? 'bg-foreground/5 text-foreground/50 border-border/30';

    return (
        <span
            className={`inline-flex items-center rounded border px-2.5 py-1 text-xs font-semibold ${cls}`}
        >
            {status}
        </span>
    );
}

export function ProjectDetail({ project }: { project: Project }) {
    return (
        <div className="w-full px-6 py-10 md:px-8 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link
                    href="/projects"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Retour aux projets
                </Link>
            </motion.div>

            {/* En-tête façon offre d'emploi */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
            >
                <Card className="mb-8 w-full min-w-0 border-border/40">
                    <CardContent className="space-y-6 p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded border border-border/40 bg-muted/50 px-2.5 py-1 text-xs font-semibold tracking-wider text-foreground/60 uppercase">
                                        {project.type}
                                    </span>
                                    <StatusBadge status={project.status} />
                                </div>

                                <h1 className="text-2xl leading-tight font-semibold tracking-tight text-foreground md:text-3xl">
                                    {project.title}
                                </h1>

                                {project.creator && (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                                                {project.creator.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-foreground/60">
                                            Par {project.creator.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
                                {project.live_url && (
                                    <Button size="lg" className="gap-2" asChild>
                                        <a
                                            href={project.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Voir le projet live
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                                {project.github_url && (
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="gap-2"
                                        asChild
                                    >
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Code source
                                            <Github className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p className="text-base leading-relaxed whitespace-pre-line text-foreground/70">
                            {project.description}
                        </p>

                        {project.tech_stack &&
                            project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center gap-1.5 rounded border border-border/40 bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground/70"
                                        >
                                            <Code2 className="h-3.5 w-3.5 text-primary/60" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Commentaires — pleine largeur */}
            <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Commentaires
                </h2>

                <Card className="w-full min-w-0 border-border/40">
                    <CardContent className="p-5">
                        <ProjectComments
                            projectId={project.id}
                            projectSlug={project.slug}
                            projectOwnerId={project.creator?.id ?? null}
                        />
                    </CardContent>
                </Card>
            </motion.section>
        </div>
    );
}
