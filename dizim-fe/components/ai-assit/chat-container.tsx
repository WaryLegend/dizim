"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/services/ai-chatbox.api";
import type { IChatMessage, ChatBoxSetting } from "@/types/chat";
import ChatToggle from "./chat-toggle";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import ChatLoading from "./chat-loading";
import ChatInput from "./chat-input";

interface ChatContainerProps {
  settings: ChatBoxSetting;
}

// Lưu session ID trong sessionStorage để giữ phiên độc lập trên mỗi tab
function getInitialChatId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const savedId = sessionStorage.getItem("current_chat_session_id");
  return savedId ? Number(savedId) : undefined;
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
  const [chatId, setChatId] = useState<number | undefined>(getInitialChatId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const primaryColor = settings?.theme_color || "#8B5CF6";
  const logoData = settings?.logo;
  const logoUrl =
    logoData?.icon?.url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256";
  const botName = logoData?.name || "Trợ Lý Dizim AI";

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", message: userMessage }]);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        mode: "general",
        session_id: chatId,
      });

      const { reply, session_id: returnedChatId } = response;

      if (!chatId && returnedChatId) {
        setChatId(returnedChatId);
        sessionStorage.setItem(
          "current_chat_session_id",
          String(returnedChatId),
        );
      }

      setMessages((prev) => [...prev, { role: "model", message: reply }]);
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
      {/* Khung chat */}
      <div
        className={`absolute bottom-20 flex h-130 w-110 origin-bottom-right flex-col overflow-hidden rounded-3xl border bg-[#F7F8FA]/90 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ borderColor: primaryColor }}
      >
        <ChatHeader logoUrl={logoUrl} botName={botName} />

        {/* Vùng tin nhắn */}
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
