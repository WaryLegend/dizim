import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { ChatBoxSetting, ChatResponse } from "@/types/chat";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "http://localhost:5678/webhook/chat";

// Cấu hình query cho Strapi
const query = qs.stringify({
  populate: { 
    logo: { 
      populate: { 
        icon: { 
          fields: [
            "url", "name", "alternativeText"
          ] 
        } 
      } 
    } 
  },
  fields: [
    "theme_color", "system_instruction", "system_constraints"
  ],
  status: "published",
});

interface CreateSessionResponse {
  data: {
    documentId: string;
    session_id: string;
  };
}

class ChatBoxService {
  // Lấy cài đặt chat box
  async getChatBoxSettings(): Promise<ChatBoxSetting> {
    return fetchStrapi<ChatBoxSetting>(`/api/chat-box-setting?${query}`);
  }

  // Khởi tạo hoặc lấy session_id từ Strapi
  async createSession(): Promise<string> {
    const res = await fetch(`${STRAPI_URL}/api/chat-sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { session_id: `sess_${Date.now()}` }
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi createSession error:", errorText);
      throw new Error("Không thể tạo session mới");
    }
    
    const result: CreateSessionResponse = await res.json();
    return result.data.session_id;
  }
}

export async function sendChatMessage(
  payload: { chatInput: string; session_id: string }
): Promise<ChatResponse> {
  try {
    const res = await fetch(CHATBOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: payload.chatInput,
        session_id: payload.session_id,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Chatbot server error: ${res.status} - ${errorText}`);
    }

    // Đọc response dưới dạng text trước để tránh lỗi Unexpected end of JSON input
    const responseText = await res.text();
    
    if (!responseText || responseText.trim() === "") {
      // Trường hợp webhook trả về rỗng nhưng vẫn thành công (200 OK)
      return { output: "" } as unknown as ChatResponse; 
    }

    try {
      return JSON.parse(responseText);
    } catch {
      // Trường hợp webhook trả về chuỗi text thuần không phải JSON
      return { output: responseText } as unknown as ChatResponse;
    }

  } catch (err) {
    console.error("API Call failed:", err);
    throw err;
  }
}

export default new ChatBoxService();