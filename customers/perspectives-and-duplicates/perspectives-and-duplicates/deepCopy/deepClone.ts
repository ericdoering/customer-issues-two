import {uuid} from '@sanity/uuid'
import type {SanityClient, SanityDocument} from 'sanity'

// Types that should become NEW documents when duplicated.
// subNavCard is intentionally left out, so cards stay shared.
export const DEEP_COPY_TYPES = ['landingPage', 'heroSlidesSection', 'heroSlide']

export const API_VERSION = '2025-02-19'

const STRIP_FIELDS = ['_id', '_rev', '_createdAt', '_updatedAt']

const baseId = (id: string) => id.replace(/^drafts\./, '')

/** Returns the _type of a document, checking the draft and published versions. */
export async function getDocumentType(client: SanityClient, id: string) {
  return client
    .withConfig({perspective: 'raw'})
    .fetch<string | null>('*[_id in [$id, "drafts." + $id]][0]._type', {id: baseId(id)})
}

/**
 * Clones a document plus every referenced document whose type is in
 * DEEP_COPY_TYPES, recursively. All copies are created as drafts in one
 * transaction. Returns the new (published-style) ID of the root copy.
 */
export async function deepClone(client: SanityClient, sourceId: string): Promise<string> {
  const raw = client.withConfig({perspective: 'raw'})
  const clones = new Map<string, string>() // original id -> new id (also prevents loops)
  const tx = raw.transaction()

  const cloneDoc = async (id: string): Promise<string> => {
    const original = baseId(id)
    const existing = clones.get(original)
    if (existing) return existing

    const newId = uuid()
    clones.set(original, newId)

    // Prefer the draft so unpublished edits are copied too
    const source: SanityDocument | undefined =
      (await raw.getDocument(`drafts.${original}`)) ?? (await raw.getDocument(original))
    if (!source) throw new Error(`Document ${original} not found`)

    const body = Object.fromEntries(
      Object.entries(source).filter(([key]) => !STRIP_FIELDS.includes(key)),
    )
    const rewritten = await rewrite(body)
    tx.create({...rewritten, _id: `drafts.${newId}`, _type: source._type})
    return newId
  }

  const rewrite = async (value: any): Promise<any> => {
    if (Array.isArray(value)) return Promise.all(value.map(rewrite))
    if (!value || typeof value !== 'object') return value

    // A reference within this dataset: clone the target if its type is allow-listed
    if (value._type === 'reference' && typeof value._ref === 'string' && !value._dataset) {
      const targetType = await getDocumentType(raw, value._ref)
      if (targetType && DEEP_COPY_TYPES.includes(targetType)) {
        const newRef = await cloneDoc(value._ref)
        // The copy only exists as a draft, so use a weak reference that
        // Studio strengthens once the copy is published
        return {...value, _ref: newRef, _weak: true, _strengthenOnPublish: {type: targetType}}
      }
      return value // shared type: keep pointing at the original
    }

    const out: Record<string, any> = {}
    for (const [key, v] of Object.entries(value)) out[key] = await rewrite(v)
    return out
  }

  const rootId = await cloneDoc(sourceId)
  await tx.commit()
  return rootId
}