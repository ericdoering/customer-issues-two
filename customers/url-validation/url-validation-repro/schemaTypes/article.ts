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
                        rule
                          .uri({
                            scheme: ['http', 'https', 'tel', 'mailto'],
                          })
                          .custom((value) => {
                            // Only check web URLs; leave tel: and mailto: to the uri() rule
                            if (!value || !/^https?:/i.test(value)) return true
                      
                            const hint =
                              'Invalid web URL. For phone numbers use tel:+<country code><number>, ' +
                              'and for emails use mailto:name@example.com'
                      
                            try {
                              const {hostname, username} = new URL(value)
                              if (username) return hint // e.g. https://name@example.com
                              return /^[a-z0-9.-]+$/i.test(hostname) || hint
                            } catch {
                              return hint
                            }
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