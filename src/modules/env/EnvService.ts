import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError, AuthInvalidDataError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import type { AuthConfig } from '../../types'

export class EnvService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }
  async getLocales(auth: AuthConfig) {
    const { apiKey } = auth

    if (!apiKey) {
      throw new AuthInvalidDataError()
    }
    if (typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const locales = await this.dittoApiClient.getVariantsAsLocales(apiKey)
    // The default locale will just map to the base text in Ditto
    return Promise.resolve({
      defaultLocale: 'base',
      locales: locales,
    })
  }

  async getCacheItemStructure() {
    return Promise.resolve({
      componentId: 'Component ID',
      status: 'Status',
      folder: 'Folder',
      notes: 'Notes',
      tags: 'Tags',
    })
  }
}
