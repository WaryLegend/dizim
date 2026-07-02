"use client";

import { X, MessageCircleMore } from "lucide-react";

interface ChatToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatToggle({ isOpen, onClick }: ChatToggleProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {isOpen ? (
        <div className="from-electric-violet to-rose flex h-full w-full items-center justify-center rounded-full bg-linear-to-r">
          <X className="h-7 w-7" />
        </div>
      ) : (
        <div className="from-electric-violet to-rose flex h-full w-full items-center justify-center rounded-full bg-linear-to-r">
          <MessageCircleMore className="h-8 w-8" />
        </div>
      )}
    </button>
  );
}
