import Image from "next/image";
import Link from "next/link";
import type { StrapiLogo } from "@/types/global";
import { STRAPI_URL } from "@/lib/utils";

interface HeaderLogoProps {
  logo: StrapiLogo[];
  siteName: string;
}

export default function HeaderLogo({ logo, siteName }: HeaderLogoProps) {
  const logoIcon = logo.find((l) => l.name === "v1")?.icon;
  const logoText = logo.find((l) => l.name === "text")?.icon;

  return (
    <Link href="/" className="flex shrink-0 items-center">
      {logoIcon && (
        <Image
          src={`${STRAPI_URL}${logoIcon.url}`}
          alt={logoIcon.alternativeText || siteName}
          width={45}
          height={50}
          className="h-10 w-auto"
        />
      )}
      {logoText && (
        <Image
          src={`${STRAPI_URL}${logoText.url}`}
          alt={logoText.alternativeText || siteName}
          width={87}
          height={15}
          className="h-4 w-auto"
        />
      )}
      {!logoIcon && !logoText && (
        <span className="text-foreground text-xl font-bold">{siteName}</span>
      )}
    </Link>
  );
}
