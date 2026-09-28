import type {ClientPerspective} from '@sanity/client'
import {createClient} from 'next-sanity'
import {perspectiveAsOf} from '@/lib/perspectives'
import {apiVersion, dataset, projectId, readToken} from './env'
import {RELEASES_QUERY} from './queries'

const baseClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
})

export function getClient(perspective: ClientPerspective) {
  return baseClient.withConfig({perspective})
}

export async function fetchAsOf<T>(
  query: string,
  params: Record<string, unknown>,
  at: Date,
) {
  const releases = await getClient('raw').fetch<{name: string; at: string}[]>(RELEASES_QUERY)
  return getClient(perspectiveAsOf(releases, at)).fetch<T>(query, params)
}
