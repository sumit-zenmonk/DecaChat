export function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Adjust so Monday is considered the 1st day of the week (ISO 8601)
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    // Calculate start of the week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        start: startOfWeek,
        end: endOfWeek
    };
}

// Helper to format date into 'YYYY-MM-DD HH:mm:ss.SSS'
const formatDate = (date) => {
    const pad = (num, size) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate(), 2);
    const hours = pad(date.getHours(), 2);
    const minutes = pad(date.getMinutes(), 2);
    const seconds = pad(date.getSeconds(), 2);

    // JS milliseconds are 3 digits, we'll pad to 5 digits like your example
    const milliseconds = pad(date.getMilliseconds(), 3) + '00';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
