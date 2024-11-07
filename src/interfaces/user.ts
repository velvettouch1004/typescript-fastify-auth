import { Document } from "mongodb";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { JWT } from "fastify-jwt";

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignUpRequest {
  name: string;
  email: string;
  password: string;
  update: boolean;
}
export type IUser = Document & ISignUpRequest & { subscribed: boolean };

export type ProtectFastifyInstance = FastifyInstance & {
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
};

export type FastifyInstaceWithJWT = FastifyInstance & { jwt: JWT };

export type FastifyRequestWithUserId = FastifyRequest & { userId: string };
