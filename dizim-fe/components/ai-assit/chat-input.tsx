"use client";

import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInput: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  primaryColor: string;
}

export default function ChatInput({
  input,
  onInput,
  onSubmit,
  isLoading,
  primaryColor,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end space-x-3 border-t border-gray-100 bg-white p-4"
    >
      <textarea
        rows={1}
        value={input}
        onChange={(e) => onInput(e.target.value)}
        disabled={isLoading}
        placeholder={
          "Nhập câu hỏi của bạn..."
        }
        className="field-sizing-content max-h-32 min-h-10 flex-1 resize-none overflow-y-auto rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm wrap-break-word whitespace-pre-wrap text-black transition-all focus:bg-white focus:outline-none disabled:opacity-60"
        style={{ borderColor: input ? primaryColor : "#E2E8F0" }}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:scale-100 disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        <Send size={18} className="translate-x-px -rotate-12 transform" />
      </button>
    </form>
  );
}