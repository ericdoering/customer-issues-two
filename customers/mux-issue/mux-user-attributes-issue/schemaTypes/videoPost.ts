import {defineType, defineField} from 'sanity'

export const videoPost = defineType({
  name: 'videoPost',
  title: 'Video post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'video', title: 'Video file', type: 'mux.video'}),
  ],
})