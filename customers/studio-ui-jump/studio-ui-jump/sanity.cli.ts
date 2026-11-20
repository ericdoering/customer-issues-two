import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'qvn50nk1',
    dataset: 'production'
  },
  deployment: {
    appId: 'jiar7o92xmwzw6sxq2zvzynq',
    autoUpdates: true,
  },
})
