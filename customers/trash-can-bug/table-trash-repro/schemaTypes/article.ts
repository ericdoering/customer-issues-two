import {defineType, defineField, defineArrayMember} from 'sanity'
import { TablePlugins } from './TablePlugins'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({type: 'contentTable'}),
      ],
      components: {
        portableText: {
          plugins: TablePlugins,
        },
      },
    }),
  ],
})

