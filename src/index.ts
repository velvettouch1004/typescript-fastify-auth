import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv";
import fastifyFormbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import { connectToDatabase } from "./config/db";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import userRoute from "./routes/user";
import courseRouter from "./routes/course";
dotenv.config();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

const server = Fastify();

server.register(fastifyFormbody);
server.register(fastifyMultipart);
server.register(passport);
server.register(fastifyCookie);

// Manage CORS
server.options("*", (req: FastifyRequest, res: FastifyReply) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res
      .header("access-control-allow-origin", origin)
      .header("access-control-allow-methods", "POST, GET, DELETE, PUT, OPTIONS")
      .header("access-control-allow-headers", "Content-Type, Authorization")
      .header("access-control-allow-credentials", "true")
      .status(204)
      .send();
  } else {
    res.code(403).send({ error: "CORS policy does not allow this" });
  }
});

server.addHook("onSend", (request, reply, _, done) => {
  const origin = request.headers.origin;
  if (allowedOrigins.includes(origin)) {
    reply
      .header("Access-Control-Allow-Origin", origin)
      .header("Access-Control-Allow-Credentials", "true")
      .header("access-control-allow-methods", "POST, GET, DELETE, PUT, OPTIONS")
      .header("access-control-allow-headers", "Content-Type, Authorization");
  }
  done();
});

// Register routes
server.register(authRoutes, { prefix: "/auth" });
server.register(userRoute, { prefix: "/user" });
server.register(courseRouter, { prefix: "/course" });

const PORT = Number(process.env.PORT);
const HOST = process.env.HOST;
// Start the server
const start = async () => {
  try {
    await connectToDatabase();
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
