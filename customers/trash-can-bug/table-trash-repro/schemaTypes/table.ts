import {defineType, defineField, defineArrayMember} from 'sanity'

export const contentTableCell = defineType({
  name: 'contentTableCell',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})

export const contentTableRow = defineType({
  name: 'contentTableRow',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      type: 'array',
      of: [defineArrayMember({type: 'contentTableCell'})],
    }),
  ],
})

export const contentTable = defineType({
  name: 'contentTable',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [defineArrayMember({type: 'contentTableRow'})],
    }),
    // Fixed field name. Without it the header-row toggle is stripped on save.
    defineField({name: 'headerRows', type: 'number'}),
  ],
})