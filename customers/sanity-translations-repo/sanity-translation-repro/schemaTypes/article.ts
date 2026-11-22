import {defineType, defineField} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [{type: 'block'}],
})

export const articleBody = defineType({
  name: 'articleBody',
  type: 'richText',
})

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'French', value: 'fr'},
        ],
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'body',
      type: 'richText',
    }),
    defineField({
      name: 'summary',
      type: 'articleBody',
    }),
    defineField({
      name: 'localizedTitle',
      title: 'Localized Title',
      type: 'internationalizedArrayString',
    }),
  ],
})