// config.ts
import { config } from "dotenv";
config();
const JWT_PASSWORD = process.env.JWT_PASSWORD as string;
const MONGO_URL = process.env.MONGO_URL as string;

export { JWT_PASSWORD, MONGO_URL };