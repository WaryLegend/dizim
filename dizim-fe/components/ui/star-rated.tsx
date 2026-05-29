import Star from "@/components/ui/star";
import { cn } from "@/lib/utils";

interface StarRatedProps {
  rated: number;
  length?: number;
  className?: string;
  starClassName?: string;
}

export default function StarRated({
  rated,
  length = 5,
  className = "",
  starClassName = "",
}: StarRatedProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length }, (_, i) => {
        const starValue = Math.max(0, Math.min(1, rated - i));
        return (
          <Star
            key={i}
            percent={starValue * 100}
            className={cn("h-5 w-5", starClassName)}
          />
        );
      })}
    </div>
  );
}
