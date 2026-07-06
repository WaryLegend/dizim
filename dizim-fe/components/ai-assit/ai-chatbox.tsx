import chatBoxService from "@/services/ai-chatbox.api";
import type { ChatBoxSetting } from "@/types/chat";
import ChatContainer from "./chat-container";

const defaultSettings: ChatBoxSetting = {
  id: 0,
  documentId: "",
  logo: {} as ChatBoxSetting["logo"],
  theme_color: "#8B5CF6",
  instruction_support: "",
  instruction_product: "",
  system_constraints: "",
};

export default async function ChatAssistant() {
  let settings = defaultSettings;

  try {
    const response = await chatBoxService.getChatBoxSettings();
    // Strapi có thể trả về { data: ... } hoặc object phẳng
    const rawData: any = response;
    settings = rawData?.data ? rawData.data : rawData;
  } catch (error) {
    console.error("Không thể tải cấu hình chatbox:", error);
  }

  return <ChatContainer settings={settings} />;
}
