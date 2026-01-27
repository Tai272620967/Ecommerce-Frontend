import axiosInstance from "../axiosConfig";

export interface ChatbotRequest {
  message: string;
  conversationId?: string;
}

export interface ChatbotResponse {
  response: string;
  conversationId: string;
  hasProductSuggestion?: boolean;
  productSuggestionUrl?: string;
}

export const sendChatbotMessageApi = async (
  request: ChatbotRequest
): Promise<ChatbotResponse> => {
  try {
    const response = await axiosInstance.post<ChatbotResponse | { data: ChatbotResponse } | { result: ChatbotResponse }>(
      "/chatbot/message",
      request
    );

    if (response.status === 200) {
      // Handle different response structures
      let data: any = response.data;
      
      // If response.data is wrapped in another object, extract it
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if ('data' in data && data.data) {
          data = data.data;
        } else if ('result' in data && data.result) {
          data = data.result;
        }
      }
      
      return data as ChatbotResponse;
    }

    throw new Error("Send chatbot message failed");
  } catch (error) {
    console.error("Send chatbot message API error:", error);
    throw error;
  }
};
