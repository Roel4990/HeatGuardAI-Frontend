export function openPopup(url: string, name: string): void {
  const width = 720;
  const height = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  const popup = window.open(
    url,
    name,
    `popup=yes,width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
