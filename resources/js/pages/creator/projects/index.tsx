import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Edit,
    ExternalLink,
    FolderOpen,
    Github,
    Plus,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    create,
    destroy,
    edit,
    show,
} from '@/actions/App/Http/Controllers/Creator/Projects/ProjectController';
import { statusColors, type Project } from './shared';

type PageProps = {
    projects: Project[];
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const handleDelete = () => {
        if (!confirm('Supprimer ce projet ?')) return;
        router.delete(destroy.url({ project: project.slug }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
        >
            <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                        src={project.image ?? '/images/project-placeholder.svg'}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    <div className="absolute top-3 left-3">
                        <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white uppercase backdrop-blur">
                            {project.type_label}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3">
                        <span
                            className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${statusColors[project.status] ?? 'border-border/30 bg-foreground/5 text-foreground/50'}`}
                        >
                            {project.status_label}
                        </span>
                    </div>
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-base leading-snug font-semibold text-foreground">
                        {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground/60">
                        {project.description}
                    </p>

                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                            {project.tech_stack.slice(0, 3).map((tech) => (
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

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {project.links?.github && (
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/40 transition-colors hover:text-foreground"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                            )}
                            {project.links?.live && (
                                <a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground/40 transition-colors hover:text-foreground"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={edit.url({ project: project.slug })}
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="secondary" size="sm" asChild>
                                <Link
                                    href={show.url({ project: project.slug })}
                                >
                                    Voir
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function CreatorProjectsIndex() {
    const { projects } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Mes Projets" />

            <div className="space-y-8 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                            Espace Creator
                        </p>
                        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                            Mes Projets
                        </h1>
                        <p className="mt-1 mb-1 text-sm text-foreground/50">
                            Ici vous verrez tous vos projets soumis.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus className="h-4 w-4" />
                            Soumettre un projet
                        </Link>
                    </Button>
                </motion.div>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={i}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center"
                    >
                        <FolderOpen className="mb-4 h-10 w-10 text-foreground/20" />
                        <p className="mb-1 font-medium text-foreground/60">
                            Aucun projet soumis
                        </p>
                        <p className="mb-6 text-sm text-foreground/40">
                            Soumets ton premier projet pour qu'il soit revu en
                            live.
                        </p>
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="h-4 w-4" />
                                Soumettre un projet
                            </Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </>
    );
}
