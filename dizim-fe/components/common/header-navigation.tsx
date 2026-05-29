"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { StrapiNavigationLink } from "@/types/global";

interface HeaderNavigationProps {
  links: StrapiNavigationLink[];
  className?: string;
  linkClassName?: string;
}

export default function HeaderNavigation({
  links,
  className,
  linkClassName,
}: HeaderNavigationProps) {
  const pathname = usePathname();

  if (!links?.length) return null;

  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            linkClassName,
            "text-sm font-medium transition-colors",
            pathname === link.href
              ? "text-rose"
              : "text-foreground/70 hover:text-foreground",
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
