import {PerspectiveToggle} from '@/components/PerspectiveToggle'
import {LandingPageView} from '@/components/LandingPageView'
import {
  BUILTIN_PERSPECTIVES,
  needsPreviewToken,
  releaseToOption,
  resolvePerspective,
  type ReleaseOption,
} from '@/lib/perspectives'
import {getClient} from '@/sanity/client'
import {readToken} from '@/sanity/env'
import {LANDING_PAGES_QUERY, RELEASES_QUERY} from '@/sanity/queries'
import type {LandingPage} from '@/sanity/types'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{perspective?: string}>
}) {
  const {perspective: perspectiveParam} = await searchParams
  const current = perspectiveParam || 'published'
  const perspective = resolvePerspective(current)
  const previewNeedsToken = needsPreviewToken(current) && !readToken

  let releases: ReleaseOption[] = []
  let pages: LandingPage[] = []
  let error: string | null = null

  try {
    if (readToken) {
      releases = await getClient('raw').fetch(RELEASES_QUERY)
    }
    pages = await getClient(perspective).fetch(LANDING_PAGES_QUERY)
  } catch (caught) {
    error = caught instanceof Error ? caught.message : 'Failed to fetch from Sanity'
  }

  const options = [...BUILTIN_PERSPECTIVES, ...releases.map(releaseToOption)]
  const active = options.find((option) => option.value === current)

  return (
    <div className="min-h-full bg-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Perspective preview
            </p>
            <p className="text-sm text-white/80">
              Same Landing Page query · {active?.label || current} view
            </p>
          </div>
          <PerspectiveToggle current={current} options={options} />
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        {!readToken ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Published is loading from the public API. Add a Viewer token as{' '}
            <code className="font-mono">SANITY_API_READ_TOKEN</code> in{' '}
            <code className="font-mono">web/.env.local</code>, then restart the app, to list Campaign
            A / Campaign B and apply draft changes.
            {previewNeedsToken
              ? ' This view still needs that token before unpublished content can appear.'
              : null}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {!error && pages.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-500">
            No Landing Page documents in the {active?.label || current} perspective.
          </p>
        ) : null}

        {pages.map((page) => (
          <LandingPageView key={page._id} page={page} />
        ))}
      </main>
    </div>
  )
}
