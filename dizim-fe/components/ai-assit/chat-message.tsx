import type { IChatMessage } from "@/types/chat";
import ReactMarkdown, { Components } from "react-markdown";
import remarkBreaks from "remark-breaks";

interface ChatMessageProps {
  message: IChatMessage;
}

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-1 wrap-break-word last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-1 list-disc pl-4 wrap-break-word">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-1 list-decimal pl-4 wrap-break-word">{children}</ol>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/10 px-1 text-sm wrap-break-word">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/10 p-3 text-sm">
      {children}
    </pre>
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      className="underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-[20px] p-3.5 text-[14px] leading-relaxed wrap-break-word ${
          isUser
            ? "from-electric-violet to-rose rounded-br-none bg-linear-to-r font-normal text-white"
            : "rounded-bl-none bg-[#ECEFF3] font-normal text-[#334155]"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          components={markdownComponents}
        >
          {message.message}
        </ReactMarkdown>
      </div>
    </div>
  );
}
