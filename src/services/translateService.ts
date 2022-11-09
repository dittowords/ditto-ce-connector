import { string } from 'zod'
import type { AuthConfig, ContentItem, IntegrationConfig, ItemIdentifiers } from '../types'
import { getWorkspaceComponents, parseName } from './dittoService'

const getContent = async (
  config: IntegrationConfig,
  auth: AuthConfig,
  locales: string[],
  ids: ItemIdentifiers[],
  // Default locale might not be needed for integration logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultLocale: string,
): Promise<[ContentItem[] | undefined, ItemIdentifiers[]]> => {
  if (!String(auth.apiKey) || auth.apiKey === '') {
    return [undefined, []]
  }

  const validatedData = await getWorkspaceComponents(auth.apiKey as string)

  if (!validatedData || !validatedData.success) {
    console.error('Unexpected data from Ditto')
    return [undefined, []]
  }

  const desiredIds = ids.map((id) => id.uniqueId)
  const filteredWorkspaceComponentEntries = Object.entries(validatedData.data).filter(
    ([wsCompId]) => desiredIds.includes(wsCompId),
  )

  const items = filteredWorkspaceComponentEntries.map(([id, data]) => {
    const localTexts = locales.reduce((acc, local) => {
      // TODO: potentially downcase/otherwise transform `local` before indexing data.variants
      // to expand the range of values that would match between Lokalise and Ditto
      // e.g.
      // Lokalise: French
      // Ditto: french
      if (data.variants && data.variants[local]) {
        acc[local] = data.variants[local].text
      } else {
        acc[local] = ''
      }

      return acc
    }, {} as Record<string, string>)

    return {
      uniqueId: id,
      groupId: parseName(data.name).groupName || 'null',
      metadata: {},
      translations: {
        ...localTexts,
        [defaultLocale]: data.text,
      },
    }
  })

  return [items, []]
}

const translateService = {
  getContent,
}

export default translateService
