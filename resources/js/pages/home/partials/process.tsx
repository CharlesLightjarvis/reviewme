import { motion } from 'framer-motion';
import { Search, UserPlus, PlayCircle, Sparkles } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: UserPlus,
        title: 'Créez votre compte',
        description:
            'Inscrivez-vous gratuitement pour suivre l’avancement de votre soumission et être informé de son passage en live.',
    },
    {
        number: '02',
        icon: Search,
        title: 'Soumettez votre projet',
        description:
            'Remplissez le formulaire avec le nom, le type (web, mobile, design...) et les liens de votre projet tech en quelques secondes.',
    },

    {
        number: '03',
        icon: PlayCircle,
        title: 'Préparation & sélection',
        description:
            'Votre projet est examiné, testé et placé dans la file d’attente du prochain live pour une revue détaillée.',
    },
    {
        number: '04',
        icon: Sparkles,
        title: 'Passez en live',
        description:
            'Votre projet est présenté en direct sur TikTok, avec des retours et une visibilité devant toute la communauté.',
    },
] as const;

export function Process() {
    return (
        <section className="relative bg-muted/30 py-24 md:py-12 dark:bg-foreground/[0.02]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/[0.03] blur-[120px] dark:bg-primary/[0.05]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
                {/* en-tête */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-20 text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2 text-xs font-semibold tracking-[0.25em] text-secondary-foreground uppercase">
                        Comment ça marche
                    </div>

                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Faire découvrir votre projet tech est simple
                    </h2>

                    <p className="mx-auto max-w-2xl text-lg text-foreground/60">
                        En quelques étapes, soumettez votre projet (web, mobile,
                        design…) et obtenez une mise en avant lors de nos lives
                        TikTok dédiés à la tech.
                    </p>
                </motion.div>

                {/* timeline */}
                <div className="relative">
                    {/* ligne horizontale — visible seulement lg */}
                    <div className="absolute top-[2.6rem] right-0 left-0 hidden h-px bg-border/50 lg:block" />

                    <div className="grid gap-10 lg:grid-cols-4 lg:gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeOut',
                                        delay: index * 0.12,
                                    }}
                                    className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
                                >
                                    {/* nœud timeline */}
                                    <div className="relative z-10 mb-6 flex h-[5.2rem] w-[5.2rem] items-center justify-center border border-border bg-background">
                                        <Icon
                                            className="h-7 w-7 text-primary"
                                            aria-hidden="true"
                                        />

                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-bold text-primary-foreground">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {step.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-foreground/60">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
