import { usePage } from '@inertiajs/react';
import { ProjectDetail } from './partials/project-detail';
import type { Project } from '@/types';

export default function ProjectShowPage() {
    const { project } = usePage<{ project: Project }>().props;

    return <ProjectDetail project={project} />;
}
