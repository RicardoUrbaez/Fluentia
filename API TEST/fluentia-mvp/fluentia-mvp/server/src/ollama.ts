import axios from "axios";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434";

export const callOllamaChat = async (model: string, messages: ChatMessage[]) => {
  try {
    const response = await axios.post(
      `${ollamaBaseUrl}/api/chat`,
      {
        model,
        messages,
        stream: false
      },
      {
        timeout: 120000
      }
    );

    return response.data?.message?.content as string;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Ollama is not reachable at http://localhost:11434. Start Ollama and run: ollama serve"
        );
      }

      const message =
        error.response?.data?.error ||
        error.message ||
        "Unknown Ollama API error";
      throw new Error(`Ollama request failed: ${message}`);
    }

    throw error;
  }
};
