import {urlFor} from '@/sanity/image'
import type {LandingPage} from '@/sanity/types'

export function LandingPageView({page}: {page: LandingPage}) {
  const sections = page.sections?.filter(Boolean) ?? []

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-100 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Landing page</p>
        <h2 className="mt-1 text-xl font-semibold text-zinc-900">{page.title || 'Untitled'}</h2>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          {page.slug ? `/${page.slug}` : 'no slug'} · _id {page._originalId || page._id}
        </p>
      </header>

      {sections.length === 0 ? (
        <p className="px-6 py-10 text-sm text-zinc-500">No sections in this perspective.</p>
      ) : (
        sections.map((section) => {
          const slides = section.slides?.filter(Boolean) ?? []
          const cards = section.subNav?.filter(Boolean) ?? []

          return (
            <section key={section._id}>
              {slides.map((slide) => {
                const imageUrl = slide.image
                  ? urlFor(slide.image).width(1600).height(800).fit('crop').url()
                  : null

                return (
                  <div key={slide._id} className="relative min-h-80 bg-zinc-900">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={slide.heading || slide.title || ''}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative flex min-h-80 flex-col justify-end px-8 py-10 text-white">
                      <h3 className="max-w-2xl text-4xl font-semibold tracking-tight">
                        {slide.heading || slide.title || 'Untitled slide'}
                      </h3>
                      {slide.ctaLabel ? (
                        <span className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900">
                          {slide.ctaLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}

              {cards.length > 0 ? (
                <div className="grid gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card) => {
                    const label = card.label || card.title || 'Untitled card'
                    const className =
                      'block rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 transition hover:border-zinc-300 hover:bg-white'

                    return card.link ? (
                      <a key={card._id} href={card.link} className={className}>
                        <p className="font-medium text-zinc-900">{label}</p>
                        <p className="mt-1 truncate text-xs text-zinc-500">{card.link}</p>
                      </a>
                    ) : (
                      <div key={card._id} className={className}>
                        <p className="font-medium text-zinc-900">{label}</p>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </section>
          )
        })
      )}
    </article>
  )
}
