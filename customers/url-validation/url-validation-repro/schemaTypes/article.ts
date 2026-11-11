import { defineArrayMember, defineField, defineType } from 'sanity'

export const article = defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              // Customer's original link annotation, unchanged
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    description:
                      'Enter a web URL, email (name@example.com), or phone number (tel:+441234567890)',
                    validation: (rule) =>
                      rule.uri({
                        scheme: ['http', 'https', 'tel', 'mailto'],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
  ],
})