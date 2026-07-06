export default function ChatLoading() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center space-x-1 rounded-[20px] rounded-bl-none bg-[#ECEFF3] p-3">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
