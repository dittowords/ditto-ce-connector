import { buildClient, sendGet, sendPut } from '@lokalise/node-core'
import type { Client } from 'undici'

import type { Dependencies } from '../../../infrastructure/diConfig'
import { AuthFailedError, UnrecognizedError } from '../../../infrastructure/errors/publicErrors'

import type {
  UpdateVariantRequestBody,
  UpdateVariantResult,
  WorkspaceComponentsByName,
  VariantDefinition,
} from './types'
import { LocaleDefinition } from '../../../modules/env/envTypes'

const retryConfig = {
  maxAttempts: 3,
  delayBetweenAttemptsInMsecs: 100,
  statusCodesToRetry: [500, 502, 503],
  retryOnTimeout: false,
}

export class APIDitto {
  private readonly client: Client

  constructor({ config }: Dependencies) {
    const host = config.integrations.ditto.baseUrl
    if (!host) {
      throw new Error('Ditto API path not provided')
    }
    this.client = buildClient(host, {
      bodyTimeout: 5000,
      headersTimeout: 5000,
    })
  }

  private extractHeaders(apiKey: string) {
    return {
      Authorization: `token ${apiKey}`,
      origin: 'lokalise',
      'Content-Type': 'application/json',
    }
  }

  public async getWorkspaceComponents(apiKey: string): Promise<WorkspaceComponentsByName> {
    const response = await sendGet<WorkspaceComponentsByName>(this.client, '/components', {
      headers: this.extractHeaders(apiKey),
      throwOnError: false,
      retryConfig,
    })

    if (response.error) {
      if (response.error.statusCode === 401) {
        throw new AuthFailedError()
      }
      throw new UnrecognizedError()
    }
    return response.result.body
  }

  public async getVariantsAsLocales(apiKey: string): Promise<LocaleDefinition[]> {
    const response = await sendGet<VariantDefinition[]>(this.client, '/variants', {
      headers: this.extractHeaders(apiKey),
      throwOnError: false,
      retryConfig,
    })

    if (response.error) {
      if (response.error.statusCode === 401) {
        throw new AuthFailedError()
      }
      throw new UnrecognizedError()
    }

    const result = response.result.body

    return result.map((item) => ({
      name: item.name,
      code: item.apiID,
    }))
  }

  public async updateVariant(
    apiKey: string,
    variant: string,
    updateVariantPayload: UpdateVariantRequestBody,
  ) {
    const response = await sendPut<UpdateVariantResult>(
      this.client,
      '/components',
      updateVariantPayload,
      {
        headers: this.extractHeaders(apiKey),
        query: { variant },
        throwOnError: true,
        retryConfig,
      },
    )

    return response.result.body
  }
}
