'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Info } from 'lucide-react'; 
import chatBoxService, { sendChatMessage } from '@/services/ai-chatbox.api';
import type { IChatMessage } from "@/types/chat";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false); 
  const [settings, setSettings] = useState<any | null>(null); // Để tạm any hoặc map theo đúng struct mới của bạn
  const [currentMode, setCurrentMode] = useState<string | null>(null); 
  const [messages, setMessages] = useState<IChatMessage[]>([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quản lý Session ID bằng sessionStorage để giữ phiên độc lập trên mỗi tab
  const [chatId, setChatId] = useState<number | undefined>(() => {
    if (typeof window !== 'undefined') {
      const savedId = sessionStorage.getItem('current_chat_session_id');
      return savedId ? Number(savedId) : undefined;
    }
    return undefined;
  });

  // Fetch cấu hình giao diện từ Strapi khi mở trang
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await chatBoxService.getChatBoxSettings();
        
        // KHẮC PHỤC LỖI ẢNH be44a1.png: 
        // Ép kiểu sang any để bóc tách an toàn xem Strapi trả về object bọc .data hay object phẳng
        const rawData: any = response;
        const configData = rawData?.data ? rawData.data : rawData;
        
        setSettings(configData);
      } catch (error) {
        console.error("Không thể tải cấu hình chatbox:", error);
      }
    }
    loadSettings();
  }, []);

  // Tự động cuộn xuống cuối khung chat khi có nội dung mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMode, isLoading, isOpen]);

  // Xử lý khi người dùng chọn Chế độ hội thoại
  const handleSelectMode = (selectedMode: 'gioi_thieu' | 'tu_van') => {
    setCurrentMode(selectedMode);
    
    const modeGreeting = selectedMode === 'gioi_thieu' 
      ? 'Bạn muốn tìm hiểu thông tin hay tính năng gì về dịch vụ của chúng tôi?' 
      : 'Bạn đang cần tư vấn chi tiết về các gói cước và giá cả phải không?';

    setMessages((prev) => [
      ...prev,
      { role: 'user', message: selectedMode === 'gioi_thieu' ? 'Xem Giới thiệu sản phẩm' : 'Cần Tư vấn dịch vụ' },
      { role: 'model', message: modeGreeting }
    ]);
  };

  // Gửi tin nhắn lên API
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentMode) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: 'user', message: userMessage }]);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        mode: currentMode,
        session_id: chatId
      });
      
      const { reply, session_id: returnedChatId } = response;

      if (!chatId && returnedChatId) {
        setChatId(returnedChatId);
        sessionStorage.setItem('current_chat_session_id', String(returnedChatId));
      }
      
      setMessages((prev) => [...prev, { role: 'model', message: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', message: 'Hệ thống bận, bạn vui lòng thử lại sau nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = settings?.theme_color || '#8B5CF6';
  
  // 2. Lấy object Logo (viết hoa chữ L)
  const logoData = settings?.logo; 
  
  // 3. Lấy đường dẫn ảnh từ logoData.icon.url
  const logoUrl = logoData?.icon?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256";
  
  // 4. Lấy tên hiển thị từ logoData.name (Trong json của bạn là "AI Assistant")
  const botName = logoData?.name || "Trợ Lý AI Đa Năng";

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      
      {/* WINDOW CHATBOX */}
      <div 
        className={`w-[440px] h-[520px] bg-[#F7F8FA] shadow-2xl rounded-[24px] flex flex-col border border-gray-100 overflow-hidden mb-4 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none absolute'
        }`}
      >
        {/* Header Dynamic */}
        <div className="bg-[#F7F8FA] p-4 flex items-center space-x-3 border-b border-gray-100">
          <div className="relative">
            <img 
              src={logoUrl.startsWith('http') ? logoUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${logoUrl}`} 
              alt={botName} 
              className="w-11 h-11 rounded-full object-cover border border-gray-200 bg-white"
            />
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></span>
          </div>
          <div>
            {/* Hiển thị tên động lấy từ trường Logo.name ("AI Assistant") */}
            <h3 className="text-[#0F172A] font-bold text-sm">{botName}</h3>
            <p className="text-[#22C55E] text-xs font-medium flex items-center">
              Online <span className="mx-1">•</span> Sẵn sàng phản hồi
            </p>
          </div>
        </div>

        {/* Nội dung vùng chat */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3.5 rounded-[20px] text-[14px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'text-white rounded-br-none font-normal' 
                    : 'bg-[#ECEFF3] text-[#334155] rounded-bl-none font-normal'
                }`}
                style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
              >
                {msg.message}
              </div>
            </div>
          ))}
          
          {/* LỰA CHỌN MODE */}
          {!currentMode && (
            <div className="flex flex-col space-y-2 p-2 bg-white rounded-[16px] border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-medium px-2 pt-1">Vui lòng chọn nhu cầu của bạn:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectMode('gioi_thieu')}
                  className="flex items-center justify-center space-x-2 p-3 rounded-[12px] text-sm font-semibold transition-all border border-gray-100 hover:bg-gray-50 text-gray-700"
                >
                  <Info size={16} style={{ color: primaryColor }} />
                  <span>Giới thiệu sản phẩm</span>
                </button>
                <button
                  onClick={() => handleSelectMode('tu_van')}
                  className="flex items-center justify-center space-x-2 p-3 rounded-[12px] text-sm font-semibold transition-all border border-gray-100 hover:bg-gray-50 text-gray-700"
                >
                  <MessageSquare size={16} style={{ color: primaryColor }} />
                  <span>Tư vấn dịch vụ & Giá</span>
                </button>
              </div>
            </div>
          )}

          {/* Hiệu ứng gõ chữ */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#ECEFF3] p-3 rounded-[20px] rounded-bl-none flex space-x-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Form Nhập chữ */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentMode}
            placeholder={currentMode ? "Nhập câu hỏi của bạn..." : "Vui lòng chọn chủ đề phía trên trước..."}
            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:bg-white text-black transition-all disabled:opacity-60"
            style={{ borderColor: input ? primaryColor : '#E2E8F0' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !currentMode}
            className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
            style={{ backgroundColor: primaryColor }}
          >
            <Send size={18} className="transform -rotate-12 translate-x-[1px]" />
          </button>
        </form>
      </div>

      {/* NÚT TRIGGER ĐÓNG MỞ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden border-2 bg-white"
        style={{ borderColor: primaryColor }} // Dùng theme color làm viền nhẹ cho nút logo thêm nổi bật
      >
        {isOpen ? (
          // Khi đang MỞ chatbox: Hiển thị icon Đóng (X) trên nền màu chủ đạo
          <div 
            className="w-full h-full flex items-center justify-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          // Khi đang ĐÓNG chatbox: Hiển thị trọn vẹn ảnh Logo đã được format đúng đường dẫn
          <img 
            src={logoUrl.startsWith('http') ? logoUrl : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${logoUrl}`} 
            alt={botName} 
            className="w-full h-full object-cover"
          />
        )}
      </button>
    </div>
  );
}