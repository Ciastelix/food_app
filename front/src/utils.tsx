export function getCurrentDateTime(): string {
  const currentDateTime = new Date();
  const year = currentDateTime.getUTCFullYear();
  const month = String(currentDateTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentDateTime.getUTCDate()).padStart(2, '0');
  const hours = String(currentDateTime.getUTCHours()).padStart(2, '0');
  const minutes = String(currentDateTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(currentDateTime.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(currentDateTime.getUTCMilliseconds()).padStart(
    3,
    '0'
  );
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  return formattedDateTime;
}

export function sanitizeHTML(html: string): string {
  const element = document.createElement('div');
  element.innerHTML = html;
  const sanitizedHTML = element.textContent || element.innerText || '';
  return sanitizedHTML;
}