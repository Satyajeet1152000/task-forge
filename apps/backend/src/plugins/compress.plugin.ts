import compress from "@fastify/compress";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function compressPlugin(app: FastifyInstance): Promise<void> {
  await app.register(compress, {
    global: true,
    encodings: ["gzip", "deflate"],
    threshold: 1024,
  });
}

export const registerCompress = fp(compressPlugin, { name: "compress" });
