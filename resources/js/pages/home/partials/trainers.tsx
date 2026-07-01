import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

type Trainer = {
    id: number;
    initials: string;
    name: string;
    specialty: string;
    bio: string;
    image: string;
    courseCount: number;
    studentCount: string;
    rating: number;
    featured?: boolean;
};

const trainers: Trainer[] = [
    {
        id: 1,
        initials: 'SL',
        name: 'Sophie Lefèvre',
        specialty: 'Mindfulness & Méditation',
        bio: 'Enseignante certifiée MBSR depuis 12 ans, Sophie a accompagné plus de 1 200 personnes vers une pratique de pleine conscience durable et transformatrice.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        courseCount: 4,
        studentCount: '3 800+',
        rating: 4.9,
        featured: true,
    },
    {
        id: 2,
        initials: 'KM',
        name: 'Kiran Mehta',
        specialty: 'Chakras & Énergie',
        bio: 'Praticien Ayurveda formé en Inde, Kiran enseigne la philosophie des chakras depuis 18 ans et a guidé plus de 2 500 élèves dans leur rééquilibrage énergétique.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        courseCount: 6,
        studentCount: '5 100+',
        rating: 4.8,
    },
    {
        id: 3,
        initials: 'ML',
        name: 'Marie-Laure Dubois',
        specialty: 'Yoga Vinyasa & Yin',
        bio: 'Professeure certifiée RYT-500, formée en Inde et à Bali. Marie-Laure guide tous les niveaux dans une pratique de yoga alliant fluidité, conscience et ancrage.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        courseCount: 5,
        studentCount: '6 200+',
        rating: 4.7,
    },
    {
        id: 4,
        initials: 'VR',
        name: 'Valérie Renaud',
        specialty: 'Sophrologie & Stress',
        bio: 'Sophrologue certifiée RNCP depuis 15 ans, Valérie accompagne des particuliers et des entreprises dans la gestion du stress, du burnout et du sommeil.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
        courseCount: 3,
        studentCount: '2 100+',
        rating: 4.8,
    },
];

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export function Trainers() {
    const featured = trainers.find((t) => t.featured) ?? trainers[0];
    const others = trainers.filter((t) => t.id !== featured.id).slice(0, 3);

    return (
        <section className="relative overflow-hidden bg-muted/30 py-24 md:py-32 dark:bg-foreground/[0.02]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-0 h-[460px] w-[460px] rounded-full bg-primary/[0.035] blur-[150px] dark:bg-primary/[0.07]" />
                <div className="absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-foreground/[0.025] blur-[130px] dark:bg-foreground/[0.045]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="max-w-2xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary px-4 py-2 text-xs font-semibold tracking-[0.25em] text-secondary-foreground uppercase backdrop-blur dark:border-border/60 dark:bg-secondary">
                            Nos formateurs
                        </div>
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                            Des experts passionnés à votre service
                        </h2>
                        <p className="text-lg leading-relaxed text-foreground/60">
                            Coachs, thérapeutes, praticiens certifiés — nos
                            formateurs sont sélectionnés pour leur expertise,
                            leur authenticité et leur capacité à transformer vos
                            pratiques.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        className="w-fit shrink-0 rounded-full"
                        asChild
                    >
                        <Link href="/become-trainer" preserveState prefetch>
                            Devenir formateur
                            <ArrowRight
                                className="ml-2 h-4 w-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </motion.div>

                {/* Featured trainer */}
                <motion.article
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="group mb-5 grid overflow-hidden rounded-3xl border border-border/40 bg-background/70 backdrop-blur-sm lg:grid-cols-[1.5fr_1fr] dark:border-border/50 dark:bg-background/50"
                >
                    {/* Image */}
                    <div className="relative min-h-[280px] overflow-hidden lg:min-h-[380px]">
                        <img
                            src={featured.image}
                            alt={featured.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20 dark:to-background/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />

                        <div className="absolute top-5 left-5">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur">
                                {featured.specialty}
                            </span>
                        </div>
                        <div className="absolute top-5 right-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur">
                                <Sparkles className="h-3 w-3" />
                                Formateur vedette
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center gap-5 p-7 md:p-10">
                        <div>
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                                {featured.initials}
                            </div>
                            <h3 className="mb-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                                {featured.name}
                            </h3>
                            <p className="mb-4 text-sm font-medium text-primary/70">
                                {featured.specialty}
                            </p>
                            <p className="text-sm leading-relaxed text-foreground/60 md:text-base">
                                {featured.bio}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/50">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4 text-primary/60" />
                                {featured.courseCount} cours publiés
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-primary/60" />
                                {featured.studentCount} étudiants
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                {featured.rating.toFixed(1)} / 5
                            </span>
                        </div>

                        <Button className="w-fit rounded-full" asChild>
                            <Link href="/courses">
                                Voir ses formations
                                <ArrowRight
                                    className="ml-2 h-4 w-4"
                                    aria-hidden="true"
                                />
                            </Link>
                        </Button>
                    </div>
                </motion.article>

                {/* 3 other trainers */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid gap-5 sm:grid-cols-3"
                >
                    {others.map((trainer) => (
                        <motion.article
                            key={trainer.id}
                            variants={itemVariants}
                            className="group overflow-hidden rounded-2xl border border-border/40 bg-background/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-md dark:border-border/50 dark:bg-background/50"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white/90 uppercase backdrop-blur">
                                        {trainer.specialty}
                                    </span>
                                </div>
                                <div className="absolute right-4 bottom-3 left-4">
                                    <p className="text-sm font-semibold text-white">
                                        {trainer.name}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-foreground/60">
                                    {trainer.bio}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/40">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        {trainer.courseCount} cours
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {trainer.studentCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {trainer.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
