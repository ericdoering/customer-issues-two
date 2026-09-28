'use client'

import {useRouter} from 'next/navigation'
import {toLocalInput, type DatedRelease} from '@/lib/perspectives'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})
}

export function TimelinePicker({
  at,
  releases,
}: {
  at: string
  releases: DatedRelease[]
}) {
  const router = useRouter()

  function setAt(next: string) {
    router.replace(`/?at=${encodeURIComponent(next)}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide text-white/50">
        Preview the site as of
        <input
          type="datetime-local"
          value={at}
          onChange={(e) => setAt(e.currentTarget.value)}
          className="mt-1 block w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/40 focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAt(toLocalInput(new Date()))}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          Now
        </button>
        {releases.map((release) => (
          <button
            key={release.name}
            type="button"
            onClick={() => setAt(toLocalInput(new Date(release.at)))}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
          >
            {release.title || release.name}: {formatDate(release.at)}
          </button>
        ))}
      </div>
    </div>
  )
}