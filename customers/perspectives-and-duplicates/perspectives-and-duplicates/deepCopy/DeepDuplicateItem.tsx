import {useState} from 'react'
import {Box, Button, Flex } from '@sanity/ui'
import { useToast } from '@sanity/ui/toast'
import {uuid} from '@sanity/uuid'
import {BookIcon} from '@sanity/icons/Book'
import {
  type ObjectItem,
  type ObjectItemProps,
  type Path,
  type ReferenceValue,
  useClient,
  useDocumentOperation,
  useFormValue,
} from 'sanity'
import {API_VERSION, DEEP_COPY_TYPES, deepClone, getDocumentType} from './deepClone'

// Converts a form path like ['sections', {_key: 'abc'}] to 'sections[_key=="abc"]'
const toJsonMatch = (path: Path) =>
  path
    .map((seg, i) =>
      typeof seg === 'string'
        ? `${i ? '.' : ''}${seg}`
        : typeof seg === 'number'
          ? `[${seg}]`
          : `[_key=="${(seg as {_key: string})._key}"]`,
    )
    .join('')

export function DeepDuplicateItem(props: ObjectItemProps<ReferenceValue & ObjectItem>) {
  const client = useClient({apiVersion: API_VERSION})
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  // The page this Sections list belongs to
  const pageId = ((useFormValue(['_id']) as string) ?? '').replace(/^drafts\./, '')
  const pageType = (useFormValue(['_type']) as string) ?? ''
  const {patch} = useDocumentOperation(pageId, pageType)

  const value = props.value
  const ref = value?._ref

  const handleClick = async () => {
    if (!ref) return
    setBusy(true)
    try {
      const targetType = await getDocumentType(client, ref)
      if (!targetType || !DEEP_COPY_TYPES.includes(targetType)) {
        toast.push({status: 'warning', title: 'This section type is shared and is not copied'})
        return
      }
      const newId = await deepClone(client, ref)
      // Insert a reference to the copy directly below the original row
      patch.execute([
        {
          insert: {
            after: toJsonMatch(props.path),
            items: [
              {
                _type: value?._type ?? 'reference',
                _key: uuid(),
                _ref: newId,
                _weak: true,
                _strengthenOnPublish: {type: targetType},
              },
            ],
          },
        },
      ])
      toast.push({status: 'success', title: 'Independent copy added below'})
    } catch (err) {
      toast.push({status: 'error', title: 'Duplicate failed', description: String(err)})
    } finally {
      setBusy(false)
    }
  }

  return (
    <Flex align="center" gap={1}>
      <Box flex={1}>{props.renderDefault(props)}</Box>
      {ref && (
        <Button
        icon={BookIcon}
          mode="bleed"
          title="Duplicate as new copy"
          aria-label="Duplicate as new copy"
          disabled={busy}
          onClick={handleClick}
        />
      )}
    </Flex>
  )
}