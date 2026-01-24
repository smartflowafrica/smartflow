
export function generateGoogleCalendarLink(event: {
    title: string;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
}): string {
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const start = formatDate(event.startTime);
    const end = formatDate(event.endTime);

    // Google Calendar URL
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append('dates', `${start}/${end}`);
    url.searchParams.append('details', event.description);
    url.searchParams.append('location', event.location);

    return url.toString();
}
