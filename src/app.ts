import Fastify from "fastify";
import { connectToDatabase } from "./config/db";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import passport from "./config/passport";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import devRoutes from "./routes/devs";
dotenv.config();

const server = Fastify();

server.register(fastifyFormbody);

server.register(cors, {
  origin: "*", // Allow all origins. Change this to specific origins as needed.
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
});
//passport
server.register(passport);

// Register routes
server.register(authRoutes, { prefix: "/auth" });
server.register(devRoutes, { prefix: "/dev" });

const PORT = Number(process.env.PORT);
const HOST = process.env.HOST as string;
// Start the server
const start = async () => {
  try {
    await connectToDatabase();
    await server.listen({ port: PORT, host: HOST });
    console.log(`Server is running on https://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
