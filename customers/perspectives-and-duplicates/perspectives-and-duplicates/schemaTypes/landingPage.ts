import {defineArrayMember, defineField, defineType} from 'sanity'
import { DeepDuplicateItem } from '../deepCopy/DeepDuplicateItem'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'heroSlidesSection'}],
          // Option B adds a line here (see B2)
        }),
      ],
    }),
    // defineField({
    //     name: 'sections',
    //     title: 'Sections',
    //     type: 'array',
    //     of: [
    //       defineArrayMember({
    //         type: 'reference',
    //         to: [{type: 'heroSlidesSection'}],
    //         components: {item: DeepDuplicateItem},
    //       }),
    //     ],
    //   }),
  ],
})