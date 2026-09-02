import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { DraftSynopsisAction } from './schemaTypes/actions/DraftSynopsisAction'

export default defineConfig({
  name: 'default',
  title: 'customer-issue-one',

  projectId: 'zdzgetzc',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'movie' ? [...prev, DraftSynopsisAction] : prev,
  },
})
