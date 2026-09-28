import {defineQuery} from 'next-sanity'

export const RELEASES_QUERY = defineQuery(`
  releases::all()[
    state in ["active", "scheduled"] &&
    defined(coalesce(publishAt, metadata.intendedPublishAt))
  ]{
    name,
    state,
    "title": metadata.title,
    "at": coalesce(publishAt, metadata.intendedPublishAt)
  }
`)

export const LANDING_PAGES_QUERY = defineQuery(`
  *[_type == "landingPage"] | order(title asc) {
    _id,
    _originalId,
    title,
    "slug": slug.current,
    sections[]->{
      _id,
      title,
      slides[]->{
        _id,
        title,
        heading,
        ctaLabel,
        image
      },
      subNav[]->{
        _id,
        title,
        label,
        link
      }
    }
  }
`)
