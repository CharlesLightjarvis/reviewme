import { motion } from 'framer-motion';
import { ClipboardCheck, BookOpen, Users, TrendingUp } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: ClipboardCheck,
        title: 'Candidature',
        description:
            'Soumettez votre demande pour rejoindre la plateforme en tant que formateur. Notre équipe évalue votre profil et votre expertise.',
    },
    {
        number: '02',
        icon: BookOpen,
        title: 'Création du cours',
        description:
            'Une fois accepté, créez et structurez vos formations bien-être depuis votre espace dédié, à votre rythme.',
    },
    {
        number: '03',
        icon: Users,
        title: 'Publication & audience',
        description:
            "Vos cours sont publiés et accessibles à notre communauté d'apprenants. Gérez vos inscriptions et interagissez avec vos élèves.",
    },
    {
        number: '04',
        icon: TrendingUp,
        title: 'Revenus & croissance',
        description:
            'Suivez vos performances, vos revenus générés et faites grandir votre activité au sein de notre écosystème.',
    },
] as const;

export function Methode() {
    return (
        <section className="relative bg-muted/30 py-24 md:py-32 dark:bg-foreground/[0.02]">
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
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary px-4 py-2 text-xs font-semibold tracking-[0.25em] text-secondary-foreground uppercase backdrop-blur dark:border-border/60 dark:bg-secondary">
                        Rejoindre en tant que formateur
                    </div>
                    <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Partagez votre expertise, développez votre activité
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-foreground/60">
                        Vous êtes coach, thérapeute ou praticien du bien-être ?
                        Rejoignez pMindfull et publiez vos formations sur notre
                        plateforme pour toucher une communauté engagée.
                    </p>
                </motion.div>

                {/* timeline */}
                <div className="relative">
                    {/* ligne horizontale — visible seulement lg */}
                    <div className="absolute top-[2.6rem] right-0 left-0 hidden h-px bg-border/50 lg:block" />

                    <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
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
                                    <div className="relative z-10 mb-6 flex h-[5.2rem] w-[5.2rem] items-center justify-center rounded-2xl border border-border/40 bg-background backdrop-blur-sm dark:border-border/50 dark:bg-background/80">
                                        <Icon
                                            className="h-7 w-7 text-primary"
                                            aria-hidden="true"
                                        />
                                        {/* numéro en surimpression */}
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* contenu */}
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
