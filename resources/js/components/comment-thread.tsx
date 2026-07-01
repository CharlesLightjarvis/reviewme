import { useState } from 'react';
import { useHttp } from '@inertiajs/react';
import { Minus, Pencil, Plus, Reply, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeDate } from '@/lib/format-date';
import { update as updateComment, destroy as destroyComment } from '@/routes/comments';

export type Comment = {
    id: number;
    parent_id: number | null;
    body: string;
    created_at: string;
    author: { id: number; name: string; initials: string };
    replies?: Comment[];
};

/** Initiales calculées côté client pour les commentaires optimistes (avant confirmation serveur). */
export function initialsOf(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

let nextOptimisticId = -1;

export function nextTempId(): number {
    return nextOptimisticId--;
}

type CurrentUser = { id: number; name: string };

type CommentThreadProps = {
    comment: Comment;
    currentUser: CurrentUser | null;
    projectOwnerId: number | null;
    onRequireAuth: () => void;
    onReplyTo: (comment: Comment) => void;
    onUpdated: (id: number, body: string) => void;
    onDeleted: (id: number) => void;
};

/** Courbe façon Reddit reliant la ligne verticale du parent à l'avatar de la réponse. */
function ThreadElbow() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="absolute -top-3 -left-6 text-border"
        >
            <path
                d="M4 0 V8 Q4 16 12 16 H24"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}

export function CommentThread({
    comment,
    currentUser,
    projectOwnerId,
    onRequireAuth,
    onReplyTo,
    onUpdated,
    onDeleted,
}: CommentThreadProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [editing, setEditing] = useState(false);
    const {
        data: editData,
        setData: setEditData,
        patch: patchComment,
    } = useHttp<{ body: string }>({ body: comment.body });
    const { delete: deleteComment } = useHttp({});

    const replies = comment.replies ?? [];
    const hasReplies = replies.length > 0;
    const canEdit = currentUser !== null && currentUser.id === comment.author.id;
    const canDelete =
        currentUser !== null &&
        (currentUser.id === comment.author.id ||
            currentUser.id === projectOwnerId);

    const handleReplyClick = () => {
        if (currentUser === null) {
            onRequireAuth();
            return;
        }

        onReplyTo(comment);
    };

    const submitEdit = () => {
        if (!editData.body.trim()) {
            return;
        }

        onUpdated(comment.id, editData.body);
        patchComment(updateComment.url(comment.id));
        setEditing(false);
    };

    const handleDelete = () => {
        if (!confirm('Supprimer ce commentaire ?')) {
            return;
        }

        onDeleted(comment.id);

        deleteComment(destroyComment.url(comment.id));
    };

    return (
        <div className="flex gap-2">
            {/* Rail : bouton de repli + avatar + ligne verticale vers les réponses */}
            <div className="flex w-8 shrink-0 flex-col items-center">
                {hasReplies && (
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? 'Déplier' : 'Replier'}
                        className="mb-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border/60 text-foreground/50 hover:bg-muted"
                    >
                        {collapsed ? (
                            <Plus className="h-2.5 w-2.5" />
                        ) : (
                            <Minus className="h-2.5 w-2.5" />
                        )}
                    </button>
                )}

                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {comment.author.initials}
                    </AvatarFallback>
                </Avatar>

                {hasReplies && !collapsed && (
                    <div className="mt-1 w-px flex-1 bg-border" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                            {comment.author.name}
                        </p>
                        <span className="shrink-0 text-[11px] text-foreground/40">
                            {formatRelativeDate(comment.created_at)}
                        </span>
                    </div>

                    {editing ? (
                        <div className="mt-1.5 space-y-2">
                            <Textarea
                                value={editData.body}
                                onChange={(e) =>
                                    setEditData('body', e.target.value)
                                }
                                rows={2}
                                autoFocus
                            />
                            <div className="flex items-center gap-2">
                                <Button type="button" size="sm" onClick={submitEdit}>
                                    Enregistrer
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditData('body', comment.body);
                                        setEditing(false);
                                    }}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-0.5 text-sm text-foreground/70">
                            {comment.body}
                        </p>
                    )}
                </div>

                {!editing && (
                    <div className="mt-1 flex items-center gap-3 px-1">
                        <button
                            type="button"
                            onClick={handleReplyClick}
                            className="flex items-center gap-1 text-xs text-foreground/40 hover:text-foreground"
                        >
                            <Reply className="h-3 w-3" />
                            Répondre
                        </button>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1 text-xs text-foreground/40 hover:text-foreground"
                            >
                                <Pencil className="h-3 w-3" />
                                Modifier
                            </button>
                        )}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center gap-1 text-xs text-foreground/40 hover:text-destructive"
                            >
                                <Trash2 className="h-3 w-3" />
                                Supprimer
                            </button>
                        )}
                    </div>
                )}

                {hasReplies && collapsed && (
                    <p className="mt-1.5 text-xs text-foreground/40 italic">
                        {replies.length} réponse{replies.length > 1 ? 's' : ''}{' '}
                        masquée{replies.length > 1 ? 's' : ''}
                    </p>
                )}

                {hasReplies && !collapsed && (
                    <div className="mt-3 space-y-3">
                        {replies.map((reply) => (
                            <div key={reply.id} className="relative">
                                <ThreadElbow />
                                <CommentThread
                                    comment={reply}
                                    currentUser={currentUser}
                                    projectOwnerId={projectOwnerId}
                                    onRequireAuth={onRequireAuth}
                                    onReplyTo={onReplyTo}
                                    onUpdated={onUpdated}
                                    onDeleted={onDeleted}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
