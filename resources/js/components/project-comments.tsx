import { useRef, useState } from 'react';
import { Link, router, useHttp, usePage } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Send, X } from 'lucide-react';
import { CommentThread, initialsOf, nextTempId } from '@/components/comment-thread';
import type { Comment } from '@/components/comment-thread';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { login } from '@/routes';
import { store as storeComment } from '@/routes/projects/comments';

function insertComment(tree: Comment[], comment: Comment): Comment[] {
    if (comment.parent_id === null) {
        return [...tree, comment];
    }

    return tree.map((node) => {
        if (node.id === comment.parent_id) {
            return { ...node, replies: [...(node.replies ?? []), comment] };
        }

        if (node.replies?.length) {
            return { ...node, replies: insertComment(node.replies, comment) };
        }

        return node;
    });
}

function updateCommentInTree(
    tree: Comment[],
    id: number,
    body: string,
): Comment[] {
    return tree.map((node) => {
        if (node.id === id) {
            return { ...node, body };
        }

        if (node.replies?.length) {
            return { ...node, replies: updateCommentInTree(node.replies, id, body) };
        }

        return node;
    });
}

function removeCommentFromTree(tree: Comment[], id: number): Comment[] {
    return tree
        .filter((node) => node.id !== id)
        .map((node) =>
            node.replies?.length
                ? { ...node, replies: removeCommentFromTree(node.replies, id) }
                : node,
        );
}

type ProjectCommentsProps = {
    projectId: number;
    projectSlug: string;
    projectOwnerId: number | null;
};

export function ProjectComments({
    projectId,
    projectSlug,
    projectOwnerId,
}: ProjectCommentsProps) {
    const page = usePage<{
        auth: { user: { id: number; name: string } | null };
        comments: Comment[];
    }>();
    const { auth, comments: serverComments } = page.props;
    const currentUrl = page.url;
    const currentUser = auth?.user ?? null;

    const [comments, setComments] = useState<Comment[]>(serverComments);
    const [syncedServerComments, setSyncedServerComments] =
        useState(serverComments);

    if (serverComments !== syncedServerComments) {
        setSyncedServerComments(serverComments);
        setComments(serverComments);
    }

    // Nos propres envois sont déjà ajoutés de façon optimiste : on retient leur
    // signature pour ignorer l'écho correspondant et éviter un doublon dans
    // CET onglet précis (comparer par utilisateur casserait le cas où le même
    // compte est ouvert dans deux onglets à la fois).
    const pendingOwnComments = useRef<Set<string>>(new Set());

    // Le point initial est requis par Echo pour les noms d'événement personnalisés
    // (broadcastAs) : sans lui, Echo écoute App\Events\CommentPosted au lieu du
    // nom brut envoyé par le serveur, et le callback ne se déclenche jamais.
    useEchoPublic<Comment>(`project.${projectId}`, '.CommentPosted', (comment) => {
        const key = `${comment.author.id}:${comment.body}`;

        if (pendingOwnComments.current.has(key)) {
            pendingOwnComments.current.delete(key);
            return;
        }

        setComments((prev) => insertComment(prev, comment));
    });

    const handleCreated = (comment: Comment) =>
        setComments((prev) => insertComment(prev, comment));
    const handleUpdated = (id: number, body: string) =>
        setComments((prev) => updateCommentInTree(prev, id, body));
    const handleDeleted = (id: number) =>
        setComments((prev) => removeCommentFromTree(prev, id));

    const { data, setData, post: postComment } = useHttp<{
        body: string;
        parent_id: number | null;
    }>({ body: '', parent_id: null });
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const composerRef = useRef<HTMLTextAreaElement>(null);

    const goToLogin = () => {
        router.visit(login({ query: { redirect: currentUrl } }).url);
    };

    const handleReplyTo = (comment: Comment) => {
        setReplyingTo(comment);
        setData({ body: `@${comment.author.name} `, parent_id: comment.id });
        composerRef.current?.focus();
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData({ body: '', parent_id: null });
    };

    const handlePostComment = () => {
        if (currentUser === null) {
            goToLogin();

            return;
        }

        if (!data.body.trim()) {
            return;
        }

        const body = data.body;
        const parentId = data.parent_id;

        pendingOwnComments.current.add(`${currentUser.id}:${body}`);

        handleCreated({
            id: nextTempId(),
            parent_id: parentId,
            body,
            created_at: new Date().toISOString(),
            author: {
                id: currentUser.id,
                name: currentUser.name,
                initials: initialsOf(currentUser.name),
            },
            replies: [],
        });

        // Envoyer avant de vider : useHttp soumet la valeur actuelle de `data`.
        postComment(storeComment.url(projectSlug));

        setData({ body: '', parent_id: null });
        setReplyingTo(null);
    };

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <CommentThread
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    projectOwnerId={projectOwnerId}
                    onRequireAuth={goToLogin}
                    onReplyTo={handleReplyTo}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                />
            ))}

            {replyingTo && (
                <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-xs text-foreground/50">
                    <span>
                        Réponse à{' '}
                        <span className="font-medium text-foreground/70">
                            {replyingTo.author.name}
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={cancelReply}
                        aria-label="Annuler la réponse"
                        className="hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="flex items-start gap-3 pt-1">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs font-semibold text-foreground/60">
                        {currentUser ? initialsOf(currentUser.name) : 'Moi'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 gap-2">
                    <Textarea
                        ref={composerRef}
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        onFocus={() => {
                            if (currentUser === null) {
                                goToLogin();
                            }
                        }}
                        placeholder={
                            currentUser === null
                                ? 'Se connecter pour commenter...'
                                : 'Écrire un commentaire...'
                        }
                        rows={2}
                        className="min-w-0 flex-1"
                    />
                    <Button
                        type="button"
                        size="icon"
                        onClick={handlePostComment}
                        className="shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!auth?.user && (
                <p className="pt-1 text-sm text-foreground/50">
                    Tu veux proposer ton propre projet ?{' '}
                    <Link
                        href="/projects/submit"
                        className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                        Soumettre mon projet
                    </Link>
                </p>
            )}
        </div>
    );
}
