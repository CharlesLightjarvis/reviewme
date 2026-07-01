import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    Code2,
    Edit,
    ExternalLink,
    Github,
    MessageCircle,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectComments } from '@/components/project-comments';
import {
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Creator/Projects/ProjectController';
import { statusColors, type Project } from './shared';

type PageProps = {
    project: Project;
    auth: { user: { id: number } | null };
};

export default function CreatorProjectShow() {
    const { project, auth } = usePage<PageProps>().props;

    const handleDelete = () => {
        if (!confirm('Supprimer ce projet ? Cette action est irréversible.')) {
            return;
        }

        router.delete(destroy.url({ project: project.slug }));
    };

    return (
        <>
            <Head title={project.title} />

            <div className="w-full space-y-6 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between gap-4"
                >
                    <Link
                        href={index.url()}
                        className="inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Retour à mes projets
                    </Link>

                    <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={edit.url({ project: project.slug })}>
                                <Edit className="h-3.5 w-3.5" />
                                Modifier
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full"
                >
                    <Card className="w-full min-w-0 border-border/40">
                        <CardContent className="space-y-6 p-5">
                            {/* En-tête façon admin/projects : miniature + infos */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-24 w-36 shrink-0 overflow-hidden rounded bg-muted">
                                    <img
                                        src={
                                            project.image ??
                                            '/images/project-placeholder.svg'
                                        }
                                        alt={project.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="truncate text-xl font-semibold text-foreground">
                                            {project.title}
                                        </h1>
                                        <span className="rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] text-foreground/50 uppercase">
                                            {project.type_label}
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${statusColors[project.status] ?? 'border-border/30 bg-foreground/5 text-foreground/50'}`}
                                        >
                                            {project.status_label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Soumis le{' '}
                                        {new Date(
                                            project.created_at,
                                        ).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>

                                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
                                    {project.links?.live && (
                                        <Button
                                            size="lg"
                                            className="gap-2"
                                            asChild
                                        >
                                            <a
                                                href={project.links.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Voir le projet live
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                    {project.links?.github && (
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="gap-2"
                                            asChild
                                        >
                                            <a
                                                href={project.links.github}
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

                            {/* Description */}
                            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/70">
                                {project.description}
                            </p>

                            {/* Stack technique */}
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

                            {/* Commentaires */}
                            <div className="border-t border-border/40 pt-6">
                                <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    Commentaires
                                </h2>

                                <ProjectComments
                                    projectId={project.id}
                                    projectSlug={project.slug}
                                    projectOwnerId={auth.user?.id ?? null}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
