import {defineField, defineType} from 'sanity'

export const subNavCard = defineType({
  name: 'subNavCard',
  title: 'Sub-nav Card',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string'}),
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'link', type: 'url'}),
  ],
})