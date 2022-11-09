import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../types'
import { getWorkspaceComponents, parseName } from './dittoService'

const listItems = async (integrationConfig: IntegrationConfig, auth: AuthConfig) => {
  if (!String(auth.apiKey) || auth.apiKey === '') {
    return undefined
  }

  const validatedData = await getWorkspaceComponents(auth.apiKey as string)

  if (!validatedData || !validatedData.success) {
    console.error('Unexpected data from Ditto')
    return undefined
  }

  return Object.entries(validatedData.data).map(([id, data]) => ({
    uniqueId: id,
    // TODO: potentially normalize the groupId here since the group name can have spaces/other unwanted chars
    groupId: parseName(data.name).groupName || 'null',
    metadata: {},
  }))
}

const getItems = async (config: IntegrationConfig, auth: AuthConfig, ids: ItemIdentifiers[]) => {
  if (!String(auth.apiKey) || auth.apiKey === '') {
    return undefined
  }

  const validatedData = await getWorkspaceComponents(auth.apiKey as string)

  if (!validatedData || !validatedData.success) {
    console.error('Unexpected data from Ditto')
    return undefined
  }

  const desiredIds = ids.map((id) => id.uniqueId)
  const filteredWorkspaceComponentEntries = Object.entries(validatedData.data).filter(
    ([wsCompId]) => desiredIds.includes(wsCompId),
  )

  return filteredWorkspaceComponentEntries.map(([id, data]) => {
    const parsedName = parseName(data.name)

    return {
      uniqueId: id,
      groupId: parseName(data.name).groupName || 'null',
      metadata: {},
      fields: {
        folder: data.folder || '',
      },
      title: parsedName.name,
      groupTitle: parsedName.groupName || 'No group',
    }
  })
}

const cacheService = {
  listItems,
  getItems,
}

export default cacheService
