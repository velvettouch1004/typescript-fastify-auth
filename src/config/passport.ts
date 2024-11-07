import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "fastify-jwt";
import fastifyPlugin from "fastify-plugin";
import dotenv from "dotenv";
import { FastifyRequestWithUserId } from "../interfaces/user";
import * as response from "../utils/responses";
dotenv.config();

const passport = async (fastify: FastifyInstance, opts: any) => {
  fastify.register(jwt, {
    secret: process.env.SECRET || "",
    sign: { expiresIn: "1h" },
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequestWithUserId, reply: FastifyReply) => {
      try {
        const result = (await request.jwtVerify()) as { id: string };
        request.userId = result.id;
      } catch (err) {
        reply.code(401).send({ error: response.UNAUTHORIZED });
      }
    }
  );
};

export default fastifyPlugin(passport);
