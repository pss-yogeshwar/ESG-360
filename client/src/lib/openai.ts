import { apiRequest } from "./queryClient";

interface AiResponse {
  message: {
    id: number;
    userId: number;
    query: string;
    response: string;
    timestamp: string;
  };
}

export async function queryAiAssistant(userId: number, query: string): Promise<AiResponse> {
  try {
    const response = await apiRequest("POST", "/api/ai-assistant/query", {
      userId,
      query,
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error querying AI assistant:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}

export async function getAiAssistantHistory(userId: number): Promise<Array<{
  id: number;
  userId: number;
  query: string;
  response: string;
  timestamp: string;
}>> {
  try {
    const response = await apiRequest("GET", `/api/ai-assistant/history/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting AI assistant history:", error);
    throw new Error("Failed to get AI assistant history");
  }
}
