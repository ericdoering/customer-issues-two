import {defineField, defineType} from 'sanity'

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fieldsets: [
    {name: 'picker', title: 'Country/Currency Picker', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({name: 'countries', type: 'array', of: [{type: 'string'}], fieldset: 'picker'}),
    defineField({name: 'currency', type: 'string', fieldset: 'picker'}),
    defineField({
      name: 'pickerObject',
      title: 'Country/Currency Picker (object)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [{name: 'currency', type: 'string'}],
    }),
    defineField({name: 'simpleMenu', title: 'Enable simple menu?', type: 'boolean'}),
  ],
})