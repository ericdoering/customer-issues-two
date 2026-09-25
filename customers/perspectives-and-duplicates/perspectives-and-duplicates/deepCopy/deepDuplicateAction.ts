import {useState} from 'react'
import {useToast} from '@sanity/ui/toast'
import {type DocumentActionComponent, useClient} from 'sanity'
import {useRouter} from 'sanity/router'
import {API_VERSION, deepClone} from './deepClone'

export const DeepDuplicateAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: API_VERSION})
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  return {
    label: busy ? 'Duplicating…' : 'Duplicate as new copy',
    disabled: busy || !(draft || published),
    onHandle: async () => {
      setBusy(true)
      try {
        const newId = await deepClone(client, id)
        toast.push({status: 'success', title: 'Independent copy created'})
        router.navigateIntent('edit', {id: newId, type}) // open the new copy
      } catch (err) {
        toast.push({status: 'error', title: 'Duplicate failed', description: String(err)})
      } finally {
        setBusy(false)
        onComplete()
      }
    },
  }
}