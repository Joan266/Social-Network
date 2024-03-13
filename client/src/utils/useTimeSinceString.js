export function timeSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
  
    if (seconds >= 31536000) {
      const interval = Math.floor(seconds / 31536000);
      return `Hace ${interval} año${interval > 1 ? 's' : ''}`;
    } else if (seconds >= 2592000) {
      const interval = Math.floor(seconds / 2592000);
      return `Hace ${interval} mes${interval > 1 ? 'es' : ''}`;
    } else if (seconds >= 86400) {
      const interval = Math.floor(seconds / 86400);
      return `Hace ${interval} dia${interval > 1 ? 's' : ''}`;
    } else if (seconds >= 3600) {
      const interval = Math.floor(seconds / 3600);
      return `Hace ${interval} hora${interval > 1 ? 's' : ''}`;
    } else {
      const interval = Math.floor(seconds / 60);
      return `Hace ${interval} minuto${interval > 1 ? 's' : ''}`;
    }
  }
  