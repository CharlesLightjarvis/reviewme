export const MIN_TECH_STACK = 2;

export const PROJECT_TYPES = [
    { value: 'web', label: 'Application Web' },
    { value: 'mobile', label: 'Application Mobile' },
    { value: 'design', label: 'Design UI/UX' },
    { value: 'no_code', label: 'No-Code / Low-Code' },
    { value: 'backend', label: 'API / Backend' },
    { value: 'tool', label: 'Outil / Extension' },
];

export type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    type: string;
    type_label: string;
    status: string;
    status_label: string;
    image: string | null;
    links: { github?: string; live?: string } | null;
    rating: number | null;
    featured: boolean;
    tech_stack: string[] | null;
    created_at: string;
};

export const statusColors: Record<string, string> = {
    submitted: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    scheduled: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    reviewed_live: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    draft: 'bg-foreground/5 text-foreground/50 border-border/30',
};
