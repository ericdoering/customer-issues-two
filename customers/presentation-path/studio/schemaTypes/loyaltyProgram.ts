import {defineType, defineField, defineArrayMember} from 'sanity'

export const loyaltyProgram = defineType({
  name: 'loyaltyProgram',
  title: 'Loyalty program',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'transferPartners',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'transferPartner',
          fields: [
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'ratio', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
})