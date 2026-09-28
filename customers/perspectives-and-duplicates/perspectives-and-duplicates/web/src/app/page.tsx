import {LandingPageView} from '@/components/LandingPageView'
import {TimelinePicker} from '@/components/TimelinePicker'
import {
  atInputValue,
  liveReleases,
  parseAtParam,
  perspectiveAsOf,
  type DatedRelease,
} from '@/lib/perspectives'
import {fetchAsOf, getClient} from '@/sanity/client'
import {readToken} from '@/sanity/env'
import {LANDING_PAGES_QUERY, RELEASES_QUERY} from '@/sanity/queries'
import type {LandingPage} from '@/sanity/types'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{at?: string}>
}) {
  const {at: atParam} = await searchParams
  const atInput = atInputValue(atParam)
  const at = parseAtParam(atParam)

  let releases: DatedRelease[] = []
  let pages: LandingPage[] = []
  let error: string | null = null

  try {
    if (readToken) {
      releases = await getClient('raw').fetch(RELEASES_QUERY)
      releases = [...releases].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
      pages = await fetchAsOf(LANDING_PAGES_QUERY, {}, at)
    } else {
      pages = await getClient('published').fetch(LANDING_PAGES_QUERY)
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : 'Failed to fetch from Sanity'
  }

  const included = liveReleases(releases, at)
  const perspective = perspectiveAsOf(releases, at)

  return (
    <div className="min-h-full bg-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Timeline preview
            </p>
            <p className="text-sm text-white/80">
              Same Landing Page query · as of {at.toLocaleString()}
            </p>
          </div>
          <div className="w-full max-w-xl">
            <TimelinePicker at={atInput} releases={releases} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        {!readToken ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Published is loading from the public API. Add a Viewer token as{' '}
            <code className="font-mono">SANITY_API_READ_TOKEN</code> in{' '}
            <code className="font-mono">web/.env.local</code>, then restart the app, to include
            dated campaign releases. The token stays on the server.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Releases</h2>
          {releases.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">
              No releases with a date yet. Undated “As soon as possible” and “Undecided” releases
              stay off the timeline.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {releases.map((release) => {
                const live = included.some((item) => item.name === release.name)
                return (
                  <li key={release.name} className="flex items-center gap-2 text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        live ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {live ? 'Included' : 'Not yet'}
                    </span>
                    <span className="text-zinc-700">
                      {release.title || release.name} (
                      {new Date(release.at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                      , {release.state})
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Perspective sent with the query
          </p>
          <pre className="mt-1 overflow-x-auto rounded-lg bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100">
            {JSON.stringify(perspective)}
          </pre>
        </section>

        {!error && pages.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-500">
            This page doesn&apos;t exist at the chosen time.
          </p>
        ) : null}

        {pages.map((page) => (
          <LandingPageView key={page._id} page={page} />
        ))}
      </main>
    </div>
  )
}
