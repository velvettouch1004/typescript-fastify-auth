import { FastifyInstance } from "fastify";
import { ProtectFastifyInstance } from "../interfaces/user";
import {
  createCourse,
  editCourse,
  getCourse,
  getCourses,
} from "../controllers/courseController";

async function userRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    { preValidation: [(fastify as ProtectFastifyInstance).authenticate] },
    createCourse
  );
  fastify.get(
    "/:courseId",
    { preValidation: [(fastify as ProtectFastifyInstance).authenticate] },
    getCourse
  );
  fastify.get(
    "/",
    { preValidation: [(fastify as ProtectFastifyInstance).authenticate] },
    getCourses
  );
  fastify.put(
    "/:courseId",
    { preValidation: [(fastify as ProtectFastifyInstance).authenticate] },
    editCourse
  );
}

export default userRoute;
