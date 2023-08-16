import type { IncomingHttpHeaders } from 'http'

import { isObject, isString } from '../../../types'

export type ApiRequest = {
  body?: Record<string, unknown>
  headers?: IncomingHttpHeaders
  apiKey: string
  query?: Partial<Record<string, string>>
  throwOnError?: boolean
}

export type UpdateVariantRequestBody = {
  data: Record<
    string,
    {
      text: string
    }
  >
}

export type Variant = {
  text: string
}

export type WorkspaceComponent = {
  name: string
  text: string
  status: string
  notes?: string
  tags?: string[]
  folder: string
  variants: Record<string, Variant>
}

export type WorkspaceComponentsByName = Record<string, WorkspaceComponent>

export type UpdateVariantResult = {
  componentsUpdated: number
  componentsSkipped: number
}

export type ErrorResponse = {
  body: {
    code: string
    msg: string
  }
}

export const isErrorResponse = (data: unknown): data is ErrorResponse =>
  isObject(data) &&
  'body' in data &&
  isObject(data.body) &&
  'code' in data.body &&
  'msg' in data.body &&
  isString(data.body.msg)

export type VariantUpdateData = Record<string, Record<string, { text: string }>>

export type DittoError = {
  body: string
  headers: Record<string, unknown>
  statusCode: number
}

export type VariantDefinition = {
  name: string
  apiID: string
}
