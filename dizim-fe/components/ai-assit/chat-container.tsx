"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/services/ai-chatbox.api";
import ChatBoxService from "@/services/ai-chatbox.api";
import type { IChatMessage, ChatBoxSetting } from "@/types/chat";
import ChatToggle from "./chat-toggle";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import ChatLoading from "./chat-loading";
import ChatInput from "./chat-input";

interface ChatContainerProps {
  settings: ChatBoxSetting;
}

const greeting: IChatMessage = {
  role: "model",
  message:
    "Xin chào! Tôi là trợ lý AI của Dizim. Bạn cần tôi hỗ trợ gì hôm nay?",
};

export default function ChatContainer({ settings }: ChatContainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IChatMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Khởi tạo là undefined để mỗi lần load trang là một session mới
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const primaryColor = settings?.theme_color || "#8B5CF6";
  const logoData = settings?.logo;
  const logoUrl =
    logoData?.icon?.url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256";
  const botName = logoData?.name || "Trợ Lý Dizim AI";

  // Hàm khởi tạo session từ Strapi
  const initializeSession = async () => {
    if (!chatId) {
      try {
        const newChatId = await ChatBoxService.createSession();
        setChatId(newChatId);
        return newChatId;
      } catch (err) {
        console.error("Failed to create session", err);
      }
    }
    return chatId;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    // Đảm bảo có chatId trước khi gửi
    const currentChatId = await initializeSession(); 
    if (!currentChatId) {
      return;
    }

    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", message: userMessage }]);

    try {
      const response = await sendChatMessage({
        chatInput: userMessage,
        session_id: String(currentChatId),
      });

      const { bot_response, image_urls } = response; // Lấy thêm image_urls
      
      setMessages((prev) => [
        ...prev, 
        { 
          role: "model", 
          message: bot_response, 
          image_urls: image_urls // Truyền ảnh vào state
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          message: "Hệ thống bận, bạn vui lòng thử lại sau nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
      <div
        className={`absolute bottom-20 flex h-130 w-110 origin-bottom-right flex-col overflow-hidden rounded-3xl border bg-[#F7F8FA]/90 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ borderColor: primaryColor }}
      >
        <ChatHeader logoUrl={logoUrl} botName={botName} />

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <ChatLoading />}
          <div ref={chatEndRef} />
        </div>

        <ChatInput
          input={input}
          onInput={setInput}
          onSubmit={handleSend}
          isLoading={isLoading}
          primaryColor={primaryColor}
        />
      </div>

      <ChatToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}