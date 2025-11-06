import { MastraClient } from "@mastra/client-js";

export const mastraClient = new MastraClient({
  baseUrl: process.env.NEXT_MASTRA_API_URL || 'https://shoppe-ai-agent-2.onrender.com',
});