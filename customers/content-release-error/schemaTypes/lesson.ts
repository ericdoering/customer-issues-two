import {defineField, defineType} from 'sanity'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'text'}),
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
  ],
})
