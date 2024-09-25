import { FastifyReply, FastifyRequest } from "fastify";
import { connectToDatabase } from "../config/db";
import { ObjectId } from "mongodb";

export const addDev = async (req: FastifyRequest, res: FastifyReply) => {
  const { title, content } = req.body as { title: string; content: string };
  const db = await connectToDatabase();
  const collection = db.collection("dev");

  const newData = {
    title,
    content,
  };
  try {
    const result = await collection.insertOne(newData);
    if (result.acknowledged) {
      return res.code(201).send({ message: "created successfully" });
    }
    return res.code(400).send({ error: "Failed to create" });
  } catch (error) {
    return res.code(500).send({ error: "Internal Server Error" });
  }
};
export const getDevs = async (req: FastifyRequest, res: FastifyReply) => {
  const db = await connectToDatabase();
  const collection = db.collection("dev");
  try {
    const data = await collection.find({}).toArray();
    return res.code(200).send(data);
  } catch (error) {
    return res.code(500).send({ error: "Internal Server Error" });
  }
};

export const getDevById = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const db = await connectToDatabase();
  const collection = db.collection("dev");
  try {
    const dev = await collection.findOne({ _id: new ObjectId(id) });
    if (dev) {
      return res.code(200).send(dev);
    }
    return res.code(404).send({ error: "Dev not found" });
  } catch (error) {
    return res.code(500).send({ error: "Internal Server Error" });
  }
};

export const updateDev = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { title, content } = req.body as { title: string; content: string };
  const db = await connectToDatabase();
  const collection = db.collection("dev");

  try {
    const result = await collection.updateOne( 
      { _id: new ObjectId(id) },
      { $set: { title, content } }
    );
    if (result.modifiedCount > 0) {
      return res.code(200).send({ message: "Updated successfully" });
    }
    return res.code(404).send({ error: "Dev not found" }); 
  } catch (error) {
    return res.code(500).send({ error: "Internal Server Error" });
  }
};

export const deleteDev = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const db = await connectToDatabase();
  const collection = db.collection("dev");

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      return res.code(200).send({ message: "Deleted successfully" });
    }
    return res.code(404).send({ error: "Dev not found" });
  } catch (error) {
    return res.code(500).send({ error: "Internal Server Error" });
  }
};
