import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'qkqhjcli',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
