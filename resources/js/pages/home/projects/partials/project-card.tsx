import { motion } from 'framer-motion';
import { Star, ArrowRight, Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export type { Project };

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-foreground/10 text-foreground/10'}`}
                />
            ))}
            <span className="ml-1 text-xs font-medium text-foreground/60">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}

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
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
        >
            {status}
        </span>
    );
}

export function ProjectCard({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
        >
            <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-lg dark:border-border/50 dark:bg-background/50">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={project.image || '/images/project-placeholder.svg'}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                        >
                            {project.type}
                        </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                        <StatusBadge status={project.status} />
                    </div>

                    {project.creator && (
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/80 text-[10px] font-bold text-primary-foreground">
                                {project.creator.initials}
                            </div>
                            <span className="text-xs font-medium text-white/80">
                                {project.creator.name}
                            </span>
                        </div>
                    )}
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-base leading-snug font-semibold text-foreground">
                        {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground/60">
                        {project.description}
                    </p>

                    <div className="mb-4 space-y-2">
                        <StarRating rating={project.rating} />
                        {project.tech_stack &&
                            project.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {project.tech_stack
                                        .slice(0, 3)
                                        .map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] text-foreground/50"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    {project.tech_stack.length > 3 && (
                                        <span className="rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] text-foreground/50">
                                            +{project.tech_stack.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/40 transition-colors hover:text-foreground"
                                >
                                    <Github
                                        className="h-4 w-4"
                                        aria-label="GitHub"
                                    />
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/40 transition-colors hover:text-foreground"
                                >
                                    <ExternalLink
                                        className="h-4 w-4"
                                        aria-label="Voir le projet"
                                    />
                                </a>
                            )}
                        </div>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={`/projects/${project.slug}`}>
                                Voir le projet
                                <ArrowRight
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
