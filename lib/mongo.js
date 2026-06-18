import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_DB_URL);
const db = client.db('dope_sasa');

export async function getMongoSession() {
  await client.connect();
  return db.collection(process.env.SESSION_NAME || 'sessions');
}
