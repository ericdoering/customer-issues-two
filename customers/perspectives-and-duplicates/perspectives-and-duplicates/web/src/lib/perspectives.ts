import type {ClientPerspective} from '@sanity/client'

export type ReleaseOption = {
  name: string
  state: string
  metadata?: {
    title?: string | null
    releaseType?: string | null
  } | null
}

export type PerspectiveOption = {
  label: string
  value: string
  kind: 'published' | 'drafts' | 'release'
}

export const BUILTIN_PERSPECTIVES: PerspectiveOption[] = [
  {label: 'Published', value: 'published', kind: 'published'},
  {label: 'Drafts', value: 'drafts', kind: 'drafts'},
]

export function releaseToOption(release: ReleaseOption): PerspectiveOption {
  return {
    label: release.metadata?.title || release.name,
    value: release.name,
    kind: 'release',
  }
}

export function resolvePerspective(value: string | undefined): ClientPerspective {
  if (!value || value === 'published') return 'published'
  if (value === 'drafts' || value === 'raw') return value
  return [value]
}

export function needsPreviewToken(value: string | undefined) {
  return Boolean(value) && value !== 'published'
}
