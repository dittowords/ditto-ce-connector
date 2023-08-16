import type { FastifyRequest } from 'fastify'

import type { EnvResponse } from './envTypes'

export const getEnv = async (req: FastifyRequest, reply: EnvResponse) => {
  const { envService } = req.diScope.cradle

  const localeData = await envService.getLocales(req.authConfig)
  const cacheItemStructure = await envService.getCacheItemStructure()

  await reply.send({
    ...localeData,
    cacheItemStructure,
  })
}
