import {defineField, defineType} from 'sanity'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'image', type: 'image'}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string'}),
  ],
})