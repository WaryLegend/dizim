import { cn } from "@/lib/utils";
import { useId } from "react";

interface StarProps {
  percent: number;
  className?: string;
}

export default function Star({ percent, className = "h-5 w-5" }: StarProps) {
  const id = useId();

  return (
    <svg
      className={cn("text-yellow-500", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop
            offset={`${Math.max(0, Math.min(100, percent))}%`}
            stopColor="currentColor"
          />
          <stop
            offset={`${Math.max(0, Math.min(100, percent))}%`}
            stopColor="transparent"
          />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
