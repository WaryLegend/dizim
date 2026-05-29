interface BgCircleProps {
  from: string;
  to: string;
  size?: number;
  className?: string;
  id?: string;
}

export default function BgCircle({
  from,
  to,
  size = 110,
  className = "",
  id,
}: BgCircleProps) {
  const gradientId = id || `bg-circle-grad-${from.replace("#", "")}-${to.replace("#", "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        opacity="0.1"
        cx="54.7359"
        cy="54.7359"
        r="54.7359"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="29.1925"
          x2="109.472"
          y2="74.8057"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
    </svg>
  );
}
