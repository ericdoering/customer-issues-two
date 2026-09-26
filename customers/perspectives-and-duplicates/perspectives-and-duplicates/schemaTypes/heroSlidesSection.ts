import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSlidesSection = defineType({
  name: 'heroSlidesSection',
  title: 'Hero Slides Section',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string'}),
    defineField({
      name: 'slides',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'heroSlide'}]})],
    }),
    defineField({
      name: 'subNav',
      title: 'Sub-nav cards',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'subNavCard'}]})],
    }),
  ],
})