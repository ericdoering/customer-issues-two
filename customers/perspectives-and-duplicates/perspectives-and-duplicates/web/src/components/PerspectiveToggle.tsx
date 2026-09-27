import Link from 'next/link'
import type {PerspectiveOption} from '@/lib/perspectives'

const kindStyles = {
  published: 'data-[active=true]:bg-emerald-600 data-[active=true]:text-white',
  drafts: 'data-[active=true]:bg-amber-500 data-[active=true]:text-white',
  release: 'data-[active=true]:bg-indigo-600 data-[active=true]:text-white',
}

export function PerspectiveToggle({
  current,
  options,
}: {
  current: string
  options: PerspectiveOption[]
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Sanity perspectives">
      {options.map((option) => {
        const active = option.value === current
        return (
          <Link
            key={option.value}
            href={`/?perspective=${option.value}`}
            data-active={active}
            className={`rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 ${kindStyles[option.kind]}`}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}
