import dotenv from 'dotenv'
import { OpenAI } from "openai"

dotenv.config();

export const openai = new OpenAI();