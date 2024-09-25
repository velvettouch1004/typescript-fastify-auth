// src/routes/authRoutes.ts
import { FastifyInstance } from "fastify";
import {
  loginUser,
  registerUser,
  getProfile,
} from "../controllers/authController";

async function authRoutes(fastify: FastifyInstance) {
  // Login route
  fastify.post("/login", loginUser);

  // Register route
  fastify.post("/register", registerUser);

  // Protected profile route
  fastify.get("/", getProfile);
}

export default authRoutes;
