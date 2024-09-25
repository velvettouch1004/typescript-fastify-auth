import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGOURI as string; // Use your MongoDB URI here
const dbName = process.env.DBNAME as string;

let db: Db | null = null;

export const connectToDatabase = async () => {
  if (!db) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log(`Connected to database: ${uri}/${dbName}`);
    } catch (error) {
      console.error("Error connecting to database:", error);
      process.exit(1);
    }
  }
  return db;
};
