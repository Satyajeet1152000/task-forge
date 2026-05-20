import { fastifyRequestContext, requestContext } from '@fastify/request-context'
import { FastifyInstance } from 'fastify'

export async function registerRequestContext(app: FastifyInstance): Promise<void> {
  await app.register(fastifyRequestContext)

  app.addHook('onRequest', async (req) => {
    requestContext.set('requestId', req.id)
  })
}
