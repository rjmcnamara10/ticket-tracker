function formatDateTime(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${weekday} ${month} ${day} ${formattedHours}:${formattedMinutes} ${ampm}`;
}

function formatShortDate(date: Date): string {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear() % 100;
  return `${month}/${day}/${year}`;
}

export { formatDateTime, formatShortDate };
