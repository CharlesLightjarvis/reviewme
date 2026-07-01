import { Head } from '@inertiajs/react';
import { Hero } from './partials/hero';
import { Process } from './partials/process';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <Hero />
            <Process />
        </>
    );
}
