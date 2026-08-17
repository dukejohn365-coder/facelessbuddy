export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value)
}

export function formatChannelAge(publishedAt: string | undefined | null): string {
  if (!publishedAt) return "Unknown"
  const created = new Date(publishedAt)
  if (Number.isNaN(created.getTime())) return "Unknown"
  const years = (Date.now() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  if (years < 1) {
    const months = Math.max(0, Math.floor(years * 12))
    return `${months} mo old`
  }
  return `${Math.floor(years)} yr${years >= 2 ? "s" : ""} old`
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))
}

export function channelUrl(channelId: string): string {
  return `https://www.youtube.com/channel/${channelId}`
}
