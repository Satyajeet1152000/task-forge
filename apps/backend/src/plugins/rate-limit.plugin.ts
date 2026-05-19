import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', '::1'],
    keyGenerator: (request) => {
      const forwarded = request.headers['x-forwarded-for'];
      const forwardedIp = typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : Array.isArray(forwarded)
          ? forwarded[0]
          : forwarded;
      return (forwardedIp as string)
        ?? (request.headers['x-real-ip'] as string)
        ?? request.ip;
    },
    errorResponseBuilder: (_request, _context) => ({
      code: 'FST_ERR_RATE_LIMIT',
    }),
  });
}

export const registerRateLimit = fp(rateLimitPlugin, { name: 'rateLimit' });
