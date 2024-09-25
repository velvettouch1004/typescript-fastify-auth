// src/routes/authRoutes.ts
import { FastifyInstance } from "fastify";
import {
  addDev,
  deleteDev,
  getDevById,
  getDevs,
  updateDev,
} from "../controllers/devController";

async function devRoutes(fastify: FastifyInstance) {
  fastify.get("/", getDevs);
  fastify.get("/:id", getDevById);
  fastify.post("/", addDev);
  fastify.put("/:id", updateDev);
  fastify.delete("/:id", deleteDev);
}

export default devRoutes;
