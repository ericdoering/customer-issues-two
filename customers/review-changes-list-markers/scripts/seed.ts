// Seeds a published doc, then a draft that adds a bullet and a numbered list item.
// Opening the doc and clicking "Review changes" shows the draft-vs-published diff.
// Run: npm run seed
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const id = 'repro-sapp-4620'

const span = (key: string, text: string) => ({_type: 'span', _key: key, text, marks: []})
const block = (key: string, text: string, list?: 'bullet' | 'number') => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [span(`${key}s`, text)],
  ...(list ? {listItem: list, level: 1} : {}),
})

const intro = [
  block('p1', 'Here are a few packing guides worth reading:'),
  block('b1', '26 cruise packing hacks you need to know before you sail', 'bullet'),
  block('b2', '12 items you should never put in your checked luggage for a cruise', 'bullet'),
]
const outro = block('p2', 'Also, don’t miss our ultimate guide to what to pack for a cruise.')

async function run() {
  const base = {_type: 'listReproArticle', title: 'SAPP-4620 list marker repro'}

  // Published version: no test list items
  await client.createOrReplace({_id: id, ...base, introBody: [...intro, outro]})

  // Draft version: adds one bullet and one numbered item
  await client.createOrReplace({
    _id: `drafts.${id}`,
    ...base,
    introBody: [
      ...intro,
      block('b3', 'bullet test', 'bullet'),
      block('n1', 'numbered test', 'number'),
      outro,
    ],
  })

  console.log(`Seeded ${id}. Open /structure/listReproArticle;${id} and click "Review changes".`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
