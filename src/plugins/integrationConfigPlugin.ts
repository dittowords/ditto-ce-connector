import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify'
import fp from 'fastify-plugin'

import { PublicNonRecoverableError } from '../infrastructure/errors/PublicNonRecoverableError'

import { decodeBase64 } from './helpers'

declare module 'fastify' {
  interface FastifyRequest {
    authConfig: Record<string, unknown>
    integrationConfig: Record<string, unknown>
  }
}

interface PluginOptions {
  skipList: string[]
}

const AUTH_HEADER = 'CE-Auth'
const CONFIG_HEADER = 'CE-Config'

function plugin(
  fastify: FastifyInstance,
  pluginOptions: PluginOptions,
  next: (err?: Error) => void,
) {
  fastify.decorateRequest('authConfig', null)
  fastify.decorateRequest('integrationConfig', null)

  const resolvedSkipList: RegExp[] = pluginOptions.skipList.map((regexStr) => new RegExp(regexStr))

  fastify.addHook(
    'onRequest',
    (req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction) => {
      // Integration configuration
      const integrationConfigHeaderData = req.headers[CONFIG_HEADER.toLowerCase()] as
        | string
        | undefined
      if (integrationConfigHeaderData) {
        const integrationConfigDecoded = decodeBase64(integrationConfigHeaderData)
        if (!integrationConfigDecoded) {
          return done(
            new PublicNonRecoverableError({
              errorCode: '401',
              message: 'Invalid configuration data provided',
            }),
          )
        }
        req.integrationConfig = integrationConfigDecoded
      }

      // Auth configuration
      if (resolvedSkipList.some((regex) => regex.test(req.routerPath))) {
        return done()
      }

      const authConfigHeaderData = req.headers[AUTH_HEADER.toLowerCase()] as string | undefined
      if (!authConfigHeaderData) {
        return done(
          new PublicNonRecoverableError({
            errorCode: '401',
            message: 'Authorization data not provided',
          }),
        )
      }

      const authConfigDecoded = decodeBase64(authConfigHeaderData)
      if (!authConfigDecoded) {
        return done(
          new PublicNonRecoverableError({
            errorCode: '400',
            message: 'Invalid authorization data provided',
          }),
        )
      }

      req.authConfig = authConfigDecoded

      return done()
    },
  )

  next()
}

const integrationConfigPlugin = fp<PluginOptions>(plugin, {
  fastify: '4.x',
  name: 'auth-token-validator-plugin',
})

export default integrationConfigPlugin
