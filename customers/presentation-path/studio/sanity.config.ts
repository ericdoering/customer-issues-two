import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {presentationTool} from 'sanity/presentation'

export default defineConfig({
  name: 'default',
  title: 'Presentation path repro',

  projectId: 'yu5apgtw',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    presentationTool({previewUrl: 'https://example.com'}),
  ],

  schema: {
    types: schemaTypes,
  },
})

