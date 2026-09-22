import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  name: 'default',
  title: 'mux-user-attributes-issue',

  projectId: 'xf5v89gb',
  dataset: 'shared-assets_staging',

  plugins: [
    structureTool(), 
    visionTool(),
    muxInput()
  ],

  schema: {
    types: schemaTypes,
  },
})
