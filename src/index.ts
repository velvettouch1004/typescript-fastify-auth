import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv";
import fastifyFormbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import { connectToDatabase } from "./config/db";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import userRoute from "./routes/user";
dotenv.config();

const server = Fastify();

server.register(fastifyFormbody);
server.register(fastifyMultipart);
server.register(passport);
server.register(fastifyCookie);

// Manage CORS for all requests
server.options("*", (req: FastifyRequest, res: FastifyReply) => {
  res
    .header("Access-Control-Allow-Origin", "*")  // Allow any origin
    .header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, OPTIONS")
    .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    .header("Access-Control-Allow-Credentials", "true")
    .status(204)
    .send();
});

// Add a hook to manage CORS headers for other requests
server.addHook("onSend", (request, reply, _, done) => {
  reply
    .header("Access-Control-Allow-Origin", "*")  // Allow any origin
    .header("Access-Control-Allow-Credentials", "true")
    .header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, OPTIONS")
    .header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  done();
});

// Register routes
server.register(authRoutes, { prefix: "/auth" });
server.register(userRoute, { prefix: "/user" });

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
