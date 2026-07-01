import { router } from '@inertiajs/react';
import { ExternalLink, Github, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    destroy,
    update,
} from '@/actions/App/Http/Controllers/Admin/Projects/ProjectController';

export const STATUS_OPTIONS = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'submitted', label: 'Soumis' },
    { value: 'scheduled', label: 'Programmé' },
    { value: 'reviewed_live', label: 'Revu en live' },
];

export const statusColors: Record<string, string> = {
    draft: 'bg-foreground/5 text-foreground/50 border-border/30',
    submitted: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    scheduled: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    reviewed_live: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
};

export type AdminProject = {
    id: number;
    title: string;
    slug: string;
    description: string;
    type_label: string;
    status: string;
    status_label: string;
    image: string | null;
    links: { github?: string; live?: string } | null;
    featured: boolean;
    tech_stack: string[] | null;
    creator: { id: number | null; name: string | null; email: string | null };
    created_at: string;
};

export function ProjectRow({ project }: { project: AdminProject }) {
    const handleStatusChange = (status: string | null) => {
        if (!status) {
            return;
        }

        router.patch(
            update.url({ project: project.slug }),
            { status },
            { preserveScroll: true },
        );
    };

    const handleFeaturedChange = (featured: boolean) => {
        router.patch(
            update.url({ project: project.slug }),
            { featured },
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        if (!confirm(`Supprimer « ${project.title} » ? Cette action est irréversible.`)) {
            return;
        }

        router.delete(destroy.url({ project: project.slug }), {
            preserveScroll: true,
        });
    };

    return (
        <Card className="w-full min-w-0 border-border/40">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                        src={project.image ?? '/images/project-placeholder.svg'}
                        alt={project.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-foreground">
                            {project.title}
                        </h3>
                        <span className="rounded border border-border/40 bg-muted/50 px-1.5 py-0.5 text-[10px] text-foreground/50 uppercase">
                            {project.type_label}
                        </span>
                    </div>

                    <p className="text-xs text-foreground/50">
                        {project.creator.name} — {project.creator.email}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                        {project.links?.live && (
                            <a
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/40 hover:text-foreground"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        )}
                        {project.links?.github && (
                            <a
                                href={project.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/40 hover:text-foreground"
                            >
                                <Github className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-foreground/60">
                        <Checkbox
                            checked={project.featured}
                            onCheckedChange={(checked) =>
                                handleFeaturedChange(!!checked)
                            }
                            size="sm"
                        />
                        Vedette
                    </label>

                    <Select
                        value={project.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger
                            className={`h-9 min-w-[9rem] text-xs ${statusColors[project.status] ?? ''}`}
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
