import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "fastify-jwt";
import fastifyPlugin from "fastify-plugin";

const passport = async (fastify: FastifyInstance, opts: any) => {
  fastify.register(jwt, {
    secret: "supersecretkey",
    sign: { expiresIn: "1h" },
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
};

export default fastifyPlugin(passport);
