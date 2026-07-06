import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { ChatBoxSetting, ChatResponse, ChatRequest } from "@/types/chat";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const query = qs.stringify({
  populate: {
    logo: {
      populate: {
        icon: {
          fields: ["url", "name", "alternativeText"],
        },
      },
    },
  },
  fields: [
    "theme_color",
    "instruction_support",
    "instruction_product",
    "system_constraints",
  ],
  status: "published",
});

class ChatBoxService {
  // Lấy cài đặt chat box từ Strapi, bao gồm cả logo đã được populate
  async getChatBoxSettings(): Promise<ChatBoxSetting> {
    return fetchStrapi<ChatBoxSetting>(`/api/chat-box-setting?${query}`);
  }
}

export async function sendChatMessage(
  payload: Omit<ChatRequest, "session_id"> & { session_id?: string | number },
): Promise<ChatResponse> {
  // nhằm tránh conflict giữa kiểu số (number) ở FE và kiểu chuỗi (string) của API
  const formattedPayload = {
    ...payload,
    session_id: payload.session_id ? String(payload.session_id) : undefined,
  };

  const res = await fetch(`${STRAPI_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error?.message || "Failed to get chat response");
  }

  return res.json();
}

export default new ChatBoxService();
