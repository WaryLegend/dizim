import Image from "next/image";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

interface ChatHeaderProps {
  logoUrl: string;
  botName: string;
}

export default function ChatHeader({ logoUrl, botName }: ChatHeaderProps) {
  return (
    <div className="flex items-center space-x-3 border-b border-gray-100 bg-[#F7F8FA] p-4">
      <div className="relative">
        <Image
          src={resolveImageUrl(logoUrl)}
          alt={botName}
          width={44}
          height={44}
          className="h-12 w-12 rounded-full border border-gray-200 bg-white object-cover"
        />
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#0F172A]">{botName}</h3>
        <p className="flex items-center text-xs font-medium text-[#22C55E]">
          Online <span className="mx-1">•</span> Sẵn sàng phản hồi
        </p>
      </div>
    </div>
  );
}
