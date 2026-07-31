import { Info, MessageSquare } from "lucide-react";

interface ChatModeSelectorProps {
  primaryColor: string;
  onSelectMode: (mode: "gioi_thieu" | "tu_van") => void;
}

export default function ChatModeSelector({
  primaryColor,
  onSelectMode,
}: ChatModeSelectorProps) {
  return (
    <div className="flex flex-col space-y-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
      <p className="px-2 pt-1 text-xs font-medium text-gray-400">
        Vui lòng chọn nhu cầu của bạn:
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectMode("gioi_thieu")}
          className="flex items-center justify-center space-x-2 rounded-[12px] border border-gray-100 p-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          <Info size={16} style={{ color: primaryColor }} />
          <span>Giới thiệu sản phẩm</span>
        </button>
        <button
          onClick={() => onSelectMode("tu_van")}
          className="flex items-center justify-center space-x-2 rounded-[12px] border border-gray-100 p-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          <MessageSquare size={16} style={{ color: primaryColor }} />
          <span>Tư vấn dịch vụ & Giá</span>
        </button>
      </div>
    </div>
  );
}
