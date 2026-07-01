export type Project = {
    id: number;
    slug: string;
    image: string;
    type: string;
    title: string;
    description: string;
    status: string;
    github_url?: string;
    live_url?: string;
    rating: number;
    featured?: boolean;
    tech_stack?: string[];
    creator?: { id: number; initials: string; name: string };
    is_submitted: boolean;
};
