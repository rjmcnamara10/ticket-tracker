export default function formatDateTime(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${weekday} ${month} ${day} ${formattedHours}:${formattedMinutes} ${ampm}`;
}
