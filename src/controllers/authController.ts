// src/controllers/authController.ts
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../config/db";

export const loginUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  const db = await connectToDatabase();

  const collection = db.collection("user");
  const user = await collection.findOne({ email });

  if (!user) {
    return res.code(401).send({ email: "Email not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.code(401).send({ password: "Invalid password" });
  }

  const token = req.server.jwt.sign(user);
  return res.send(token);
};

export const registerUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const db = await connectToDatabase();
  const collection = db.collection("user");
  const existingUser = await collection.findOne({ email });

  if (existingUser) {
    return res.code(409).send({ email: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    
    name,
    email,
    password: hashedPassword,
  };

  try {
    const result = await collection.insertOne(newUser);
    if (result.acknowledged) {
      return res.code(201).send({ message: "User created successfully" });
    }
    return res.code(400).send({ error: "Failed to create user" });
  } catch (error) {
    req.log.error(error);
    return res.code(500).send({ error: "Internal Server Error" });
  }
};

export const getProfile = async (req: FastifyRequest, res: FastifyReply) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.code(401).send({ error: "Token missing" });
  }

  try {
    const decoded = req.server.jwt.verify(token);
    return res.send(decoded);
  } catch (err) {
    req.log.error(err);
    return res.code(401).send({ error: "Invalid or expired token" });
  }
};
