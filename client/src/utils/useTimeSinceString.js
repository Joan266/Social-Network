export function timeSince(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
      return `${interval}years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return `${interval}months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return `${interval}d`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return `${interval}h`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return `${interval}m`;
  }
  return `${Math.floor(seconds)} seconds ago`;
}
