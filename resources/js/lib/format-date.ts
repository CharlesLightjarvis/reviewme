/** Formate une date en "il y a X min/h" pour les événements récents, sinon en date courte. */
export function formatRelativeDate(value: string): string {
    const date = new Date(value);
    const diffMin = Math.round((Date.now() - date.getTime()) / 60000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;

    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}
