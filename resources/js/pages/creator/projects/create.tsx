import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { MediaUpload } from '@/components/media-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Creator/Projects/ProjectController';
import { MIN_TECH_STACK, PROJECT_TYPES } from './shared';

export default function CreatorProjectCreate() {
    const [techInput, setTechInput] = useState('');
    const [techStack, setTechStack] = useState<string[]>([]);

    const addTech = () => {
        const value = techInput.trim();

        if (value && !techStack.includes(value)) {
            setTechStack((p) => [...p, value]);
        }

        setTechInput('');
    };

    const removeTech = (tech: string) => {
        setTechStack((p) => p.filter((t) => t !== tech));
    };

    return (
        <>
            <Head title="Soumettre un projet" />

            <div className="w-full space-y-8 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href={index.url()}
                        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Retour à mes projets
                    </Link>

                    <div className="mt-4">
                        <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                            Espace Creator
                        </p>

                        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                            Soumettre un projet
                        </h1>

                        <p className="mt-1 text-sm text-foreground/50">
                            Remplis les informations pour soumettre ton projet à
                            la revue live.
                        </p>
                    </div>
                </motion.div>

                <Form {...store.form()} className="w-full space-y-6">
                    {({ processing, errors, clearErrors }) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="w-full space-y-6"
                        >
                            {techStack.map((tech, i) => (
                                <input
                                    key={i}
                                    type="hidden"
                                    name={`tech_stack[${i}]`}
                                    value={tech}
                                />
                            ))}

                            <div className="flex w-full flex-col gap-6">
                                {/* Informations générales */}
                                <Card className="w-full min-w-0 border-border/40">
                                    <CardContent className="space-y-5 p-6">
                                        <h2 className="text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                            Informations générales
                                        </h2>

                                        <div className="space-y-1.5">
                                            <Label>
                                                Titre du projet{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                name="title"
                                                placeholder="Mon super projet"
                                                onChange={() =>
                                                    clearErrors('title')
                                                }
                                            />
                                            <InputError message={errors.title} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>
                                                Description{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Textarea
                                                name="description"
                                                placeholder="Décris ton projet en quelques phrases..."
                                                rows={4}
                                                onChange={() =>
                                                    clearErrors('description')
                                                }
                                            />
                                            <InputError
                                                message={errors.description}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>
                                                Type de projet{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                name="type"
                                                defaultValue="web"
                                                items={PROJECT_TYPES}
                                                onValueChange={() =>
                                                    clearErrors('type')
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROJECT_TYPES.map((t) => (
                                                        <SelectItem
                                                            key={t.value}
                                                            value={t.value}
                                                        >
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.type} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Image du projet</Label>
                                            <MediaUpload name="image" />
                                            <InputError message={errors.image} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Liens */}
                                <Card className="w-full min-w-0 border-border/40">
                                    <CardContent className="space-y-5 p-6">
                                        <h2 className="text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                            Liens
                                        </h2>

                                        <div className="space-y-1.5">
                                            <Label>
                                                Projet live{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                type="url"
                                                name="links[live]"
                                                placeholder="https://monprojet.com"
                                                onChange={() =>
                                                    clearErrors('links.live')
                                                }
                                            />
                                            <InputError
                                                message={errors['links.live']}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>GitHub (facultatif)</Label>
                                            <Input
                                                type="url"
                                                name="links[github]"
                                                placeholder="https://github.com/..."
                                                onChange={() =>
                                                    clearErrors('links.github')
                                                }
                                            />
                                            <InputError
                                                message={errors['links.github']}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Stack technique */}
                                <Card className="w-full min-w-0 border-border/40">
                                    <CardContent className="space-y-5 p-6">
                                        <h2 className="text-xs font-semibold tracking-[0.25em] text-foreground/40 uppercase">
                                            Stack technique{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </h2>

                                        <p className="text-xs text-foreground/50">
                                            Ajoute au moins {MIN_TECH_STACK}{' '}
                                            technologies.
                                        </p>

                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={techInput}
                                                onChange={(e) =>
                                                    setTechInput(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTech();
                                                    }
                                                }}
                                                placeholder="React, Laravel, Tailwind..."
                                                className="min-w-0 flex-1"
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    addTech();
                                                    clearErrors('tech_stack');
                                                }}
                                                className="shrink-0"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="inline-flex items-center gap-1.5 rounded border border-border/40 bg-muted/50 px-2.5 py-1 text-sm font-medium text-foreground/70"
                                                    >
                                                        {tech}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeTech(
                                                                    tech,
                                                                )
                                                            }
                                                            className="text-foreground/40 hover:text-foreground"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <InputError
                                            message={errors.tech_stack}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button variant="outline" asChild>
                                    <Link href={index.url()}>Annuler</Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        techStack.length < MIN_TECH_STACK
                                    }
                                >
                                    {processing
                                        ? 'Envoi...'
                                        : 'Soumettre le projet'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </Form>
            </div>
        </>
    );
}
