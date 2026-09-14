import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'
import { lesson } from './schemaTypes/lesson'

export default defineConfig({
  name: 'default',
  title: 'content-release-error',

  projectId: 'g3gnfb6j',
  dataset: 'repro-cldx-6181',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'es', title: 'Spanish'},
      ],
      schemaTypes: ['lesson'],
    }),
  ],

  schema: {types: [lesson]}
})
