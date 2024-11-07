import { FastifyInstance } from "fastify";
import { ProtectFastifyInstance } from "../interfaces/user";
import { getUserInfo } from "../controllers/userController";

async function userRoute(fastify: FastifyInstance) {
  fastify.get(
    "/",
    { preValidation: [(fastify as ProtectFastifyInstance).authenticate] },
    getUserInfo
  );
}

export default userRoute;
