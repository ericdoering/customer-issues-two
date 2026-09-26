import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { DeepDuplicateAction } from './deepCopy/deepDuplicateAction'
const DEEP_COPY_TYPES = ['landingPage']

export default defineConfig({
  name: 'default',
  title: 'perspectives-and-duplicates',

  projectId: 'wdf0nv1a',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
  document: {
    // On allow-listed types: add "Duplicate as new copy" and remove the
    // default (linked) Duplicate so editors can't make a linked copy by accident
    actions: (prev, context) =>
      DEEP_COPY_TYPES.includes(context.schemaType)
        ? [...prev.filter((action) => action.action !== 'duplicate'), DeepDuplicateAction]
        : prev,
  },
})
