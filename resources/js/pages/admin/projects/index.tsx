import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectRow, type AdminProject } from './project-row';

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type PageProps = {
    projects: Paginated<AdminProject>;
};

export default function AdminProjectsIndex() {
    const { projects } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Modération des projets" />

            <div className="w-full space-y-6 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                        Espace Admin
                    </p>
                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                        Modération des projets
                    </h1>
                    <p className="mt-1 text-sm text-foreground/50">
                        {projects.total} projet{projects.total > 1 ? 's' : ''}{' '}
                        au total — change le statut, mets en vedette ou
                        supprime un projet.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex w-full flex-col gap-4"
                >
                    {projects.data.length > 0 ? (
                        projects.data.map((project) => (
                            <ProjectRow key={project.id} project={project} />
                        ))
                    ) : (
                        <p className="py-16 text-center text-sm text-foreground/40">
                            Aucun projet pour le moment.
                        </p>
                    )}
                </motion.div>

                {(projects.prev_page_url || projects.next_page_url) && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!projects.prev_page_url}
                            asChild={!!projects.prev_page_url}
                        >
                            {projects.prev_page_url ? (
                                <Link href={projects.prev_page_url}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                            )}
                        </Button>

                        <span className="text-sm text-foreground/50">
                            Page {projects.current_page} / {projects.last_page}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!projects.next_page_url}
                            asChild={!!projects.next_page_url}
                        >
                            {projects.next_page_url ? (
                                <Link href={projects.next_page_url}>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
