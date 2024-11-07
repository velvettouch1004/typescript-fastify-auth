import { FastifyInstance } from "fastify";
import {
  loginUser,
  registerUser,
  refreshUser,
  signout,
} from "../controllers/authController";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", loginUser);
  fastify.post("/signup", registerUser);
  fastify.post("/refresh", refreshUser);
  fastify.post("/signout", signout);
}

export default authRoutes;
