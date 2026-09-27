import type {ClientPerspective} from '@sanity/client'
import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId, readToken} from './env'

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
