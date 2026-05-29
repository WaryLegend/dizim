import Link from "next/link";
import type { StrapiButton as StrapiButtonType } from "@/types/global";
import { cn } from "@/lib/utils";

interface StrapiButtonProps {
  button?: StrapiButtonType;
  variant?: "Text" | "Filled" | "Ghost" | "Shaded";
  color?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

const DEFAULT_DARK = "var(--foreground)";

export default function StrapiButton({
  button,
  variant,
  color,
  href,
  onClick,
  className = "",
  children,
  disabled,
  type = "button",
  style: externalStyle,
}: StrapiButtonProps) {
  const activeVariant = variant ?? button?.button_style ?? "Filled";
  const activeColor = color ?? button?.color ?? DEFAULT_DARK;
  const activeHref = href ?? button?.href;

  const baseClasses =
    "inline-flex w-fit items-center gap-2 text-sm font-semibold cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50";

  let internalStyle: React.CSSProperties = {};
  let variantClasses = "";

  switch (activeVariant) {
    case "Text":
      variantClasses = "bg-transparent hover:not-disabled:underline";
      internalStyle = { color: activeColor };
      break;

    case "Filled":
      variantClasses =
        "rounded-full px-5 py-2 not-disabled:active:scale-95 shadow-sm";
      internalStyle = { backgroundColor: activeColor, color: "#FFFFFF" };
      break;

    case "Ghost":
      variantClasses =
        "rounded-full border bg-transparent px-5 py-2 not-disabled:active:scale-95 shadow-sm";
      internalStyle = { borderColor: activeColor, color: activeColor };
      break;

    case "Shaded":
      variantClasses =
        "rounded-full px-5 py-2 not-disabled:active:scale-95 shadow-sm";
      internalStyle = {
        backgroundColor: `color-mix(in srgb, ${activeColor} 10%, transparent)`,
        color: activeColor,
      };
      break;

    default:
      variantClasses = "rounded-full";
      internalStyle = { backgroundColor: DEFAULT_DARK, color: "#FFFFFF" };
  }

  const combinedClassName = cn(`${baseClasses} ${variantClasses}`, className);
  const mergedStyle = { ...internalStyle, ...externalStyle };
  const content = children || button?.text;

  if (activeHref) {
    return (
      <Link href={activeHref} className={combinedClassName} style={mergedStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      style={mergedStyle}
    >
      {content}
    </button>
  );
}
