import type z from 'zod'

import type { ApiReply } from '../commonTypes'

import type { envResponseBody } from './envSchemas'

export type EnvResponseBody = z.infer<typeof envResponseBody>

export type EnvResponse = ApiReply<EnvResponseBody>

export type LocaleDefinition = {
  name: string
  code: string
}

export type LocalesAvailable = {
  defaultLocale: string
  locales: LocaleDefinition[]
}
