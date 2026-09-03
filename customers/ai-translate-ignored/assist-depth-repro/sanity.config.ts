import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { assist } from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'assist-depth-repro',

  projectId: 'po7ette7',
  dataset: 'production',


  plugins: [
    structureTool(),
    visionTool(),
    assist({
      assist: {
        maxPathDepth: 12,
      },
      translate: {
        field: {
          languages: [
            {id: 'en', title: 'English'},
            {id: 'es', title: 'Spanish'},
          ],
          maxPathDepth: 16,
        },
      },
    }),
  ],
 
  schema: {
    types: schemaTypes,
  },
})
