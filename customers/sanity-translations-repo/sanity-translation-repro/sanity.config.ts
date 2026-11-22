import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {assist} from '@sanity/assist'

export default defineConfig({
  name: 'default',
  title: 'sanity-translations-repo',

  projectId: 'aehb7360',
  dataset: 'dev',

  plugins: [
    structureTool(),
    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'French'},
      ],
      fieldTypes: ['string'],
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['article'],
        },
        field: {
          documentTypes: ['article'],
          languages: [
            {id: 'en', title: 'English'},
            {id: 'fr', title: 'French'},
          ],
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
