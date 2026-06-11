"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
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
  const locale = useLocale();

  const segments = pathname.split("/");
  const normalizedPath = "/" + segments.slice(2).join("/");

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/" && normalizedPath.startsWith(href + "/"));

  if (!links?.length) return null;

  return (
    <nav className={className}>
      {links.map((link) => {
        const localizedHref = link.href.startsWith("/")
          ? `/${locale}${link.href}`
          : link.href;

        return (
          <Link
            key={link.id}
            href={localizedHref}
            className={cn(
              linkClassName,
              "text-sm font-medium transition-colors",
              isActive(link.href)
                ? "text-rose"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
