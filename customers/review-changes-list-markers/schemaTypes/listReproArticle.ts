import {defineArrayMember, defineField, defineType} from 'sanity'

// SAPP-4620: Review Changes drops bullet/number markers for PT list items.
export const listReproArticle = defineType({
  name: 'listReproArticle',
  title: 'List repro article',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'introBody',
      title: 'Intro Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        }),
      ],
    }),
  ],
})
