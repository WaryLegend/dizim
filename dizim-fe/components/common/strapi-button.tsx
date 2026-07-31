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
    "inline-flex w-fit items-center gap-2 text-sm font-semibold cursor-pointer transition-all duration-250 disabled:cursor-not-allowed disabled:opacity-50 shrink-0";

  let variantClasses = "";

  switch (activeVariant) {
    case "Text":
      variantClasses =
        "bg-transparent text-[var(--btn-color)] hover:not-disabled:underline";
      break;

    case "Filled":
      // Hover nhạt hơn: Pha 85% màu gốc với màu trắng (white)
      variantClasses =
        "rounded-full px-5 py-2 text-white bg-[var(--btn-color)] hover:not-disabled:bg-[color-mix(in_srgb,var(--btn-color)_85%,white)] not-disabled:active:scale-95 shadow-sm";
      break;

    case "Ghost":
      // Hover: Thêm một lớp nền mờ 10% của chính màu đó
      variantClasses =
        "rounded-full px-5 py-2 border border-[var(--btn-color)] text-[var(--btn-color)] bg-transparent hover:not-disabled:bg-[color-mix(in_srgb,var(--btn-color)_10%,transparent)] not-disabled:active:scale-95 shadow-sm";
      break;

    case "Shaded":
      // Hover: Tăng độ đậm của nền từ 10% lên 20%
      variantClasses =
        "rounded-full px-5 py-2 bg-[color-mix(in_srgb,var(--btn-color)_10%,transparent)] text-[var(--btn-color)] hover:not-disabled:bg-[color-mix(in_srgb,var(--btn-color)_20%,transparent)] not-disabled:active:scale-95 shadow-sm";
      break;

    default:
      variantClasses = "rounded-full bg-[var(--btn-color)] text-white";
  }

  const combinedClassName = cn(`${baseClasses}`, variantClasses, className);

  const mergedStyle = {
    "--btn-color": activeColor,
    ...externalStyle,
  } as React.CSSProperties;
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
