export function formatDate(dateString) {
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}