export function getChatTimeFormat(createdAt: any) {
    const now = new Date() as any;
    const postDate = new Date(createdAt) as any;
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;

    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}