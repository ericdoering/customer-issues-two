import type {ClientPerspective} from '@sanity/client'

export type DatedRelease = {
  name: string
  title?: string | null
  state: string
  at: string
}

// <input type="datetime-local"> expects local time as "YYYY-MM-DDTHH:mm"
export function toLocalInput(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function atInputValue(value: string | string[] | undefined) {
  const raw = firstString(value)
  if (raw && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) return raw
  return toLocalInput(new Date())
}

export function parseAtParam(value: string | string[] | undefined) {
  const parsed = new Date(atInputValue(value))
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export function liveReleases(releases: DatedRelease[], at: Date) {
  return releases
    .filter((release) => Date.parse(release.at) <= at.getTime())
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
}

export function perspectiveAsOf(releases: DatedRelease[], at: Date): ClientPerspective {
  const stack = liveReleases(releases, at).map((release) => release.name)
  return stack.length ? stack : 'published'
}
