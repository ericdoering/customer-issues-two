import {useState} from 'react'
import {SparkleIcon} from '@sanity/icons/Sparkle'
import {useToast} from '@sanity/ui/toast'
import {DocumentActionComponent, useClient} from 'sanity'

const SCHEMA_ID = '_.schemas.default' // from `sanity schemas list`

export const DraftSynopsisAction: DocumentActionComponent = (props) => {
  const {id} = props
  const client = useClient({apiVersion: 'vX'}).withConfig({useCdn: false})
  const toast = useToast()
  const [isRunning, setIsRunning] = useState(false)

  return {
    label: isRunning ? 'Writing…' : 'Draft synopsis',
    icon: SparkleIcon,
    disabled: isRunning,
    onHandle: async () => {
      setIsRunning(true)
      try {
        await client.agent.action.generate({
          schemaId: SCHEMA_ID,
          documentId: id,
          instruction:
            'Write a synopsis for the film "$title", released $year. ' +
            'Two or three sentences, present tense, no spoilers, no marketing language.' +
            'Do not use any dashes "-" in the synopsis.',
          instructionParams: {
            title: {type: 'field', path: 'title'},
            year: {type: 'field', path: 'releaseDate'},
          },
          target: {path: 'overview'},
        })
        toast.push({status: 'success', title: 'Synopsis drafted'})
      } catch (err) {
        toast.push({
          status: 'error',
          title: 'Could not draft synopsis',
          description: err instanceof Error ? err.message : String(err),
        })
      } finally {
        setIsRunning(false)
      }
    },
  }
}