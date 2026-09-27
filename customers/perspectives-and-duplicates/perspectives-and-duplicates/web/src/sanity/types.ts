import type {SanityImageSource} from '@sanity/image-url'

export type HeroSlide = {
  _id: string
  title: string | null
  heading: string | null
  ctaLabel: string | null
  image: SanityImageSource | null
}

export type SubNavCard = {
  _id: string
  title: string | null
  label: string | null
  link: string | null
}

export type HeroSlidesSection = {
  _id: string
  title: string | null
  slides: HeroSlide[] | null
  subNav: SubNavCard[] | null
}

export type LandingPage = {
  _id: string
  _originalId?: string | null
  title: string | null
  slug: string | null
  sections: HeroSlidesSection[] | null
}
