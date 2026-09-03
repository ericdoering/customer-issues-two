import {defineContainer} from '@portabletext/editor'
import type {PortableTextPluginsProps} from 'sanity'

// Module scope on purpose: a fresh object identity re-registers the
// plugin on every render.
// No `render` on any container — that's what selects studioTableRender.
const tableContainers = {
  table: defineContainer({type: 'contentTable', arrayField: 'rows'}),
  row: defineContainer({type: 'contentTableRow', arrayField: 'cells'}),
  cell: defineContainer({type: 'contentTableCell', arrayField: 'value'}),
}

export function TablePlugins(props: PortableTextPluginsProps) {
  return props.renderDefault({
    ...props,
    plugins: {
      ...props.plugins,
      table: {enabled: true, containers: tableContainers},
    },
  })
}