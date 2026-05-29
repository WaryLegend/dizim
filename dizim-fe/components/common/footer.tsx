import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import type {
  StrapiLogo,
  StrapiSocialMedia,
  StrapiLocation,
  StrapiNavigation,
} from "@/types/global";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help Center" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/api", label: "API Docs" },
];

interface FooterProps {
  logo: StrapiLogo[];
  siteName: string;
  SocialMedia: StrapiSocialMedia[];
  location: StrapiLocation[];
  navigation: StrapiNavigation | null;
  open_hours: string;
  contact_email: string;
  contact_phone: string;
  copyright: string;
}

export default function Footer({
  logo,
  siteName,
  SocialMedia,
  location,
  navigation,
  open_hours,
  contact_email,
  contact_phone,
  copyright,
}: FooterProps) {
  const logoIcon = logo.find((l) => l.name === "v1")?.icon;
  const logoText = logo.find((l) => l.name === "text")?.icon;

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
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
                  alt={siteName}
                  width={87}
                  height={15}
                  className="h-4 w-auto"
                />
              )}
              {!logoIcon && !logoText && (
                <span className="text-xl font-bold">{siteName}</span>
              )}
            </Link>
            <p className="mb-2 max-w-xs text-sm font-bold">FOLLOW US:</p>
            <div className="flex items-center gap-3">
              {SocialMedia.map((social) => (
                <Link
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-electric-violet/10 hover:bg-electric-violet flex items-center justify-center rounded-full transition-colors"
                  aria-label={social.platform}
                >
                  {social.icon && (
                    <Image
                      src={`${STRAPI_URL}${social.icon.url}`}
                      alt={social.platform}
                      width={18}
                      height={18}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-5 text-xs font-semibold tracking-wider uppercase">
              {navigation?.title || "Directories"}
            </h4>
            <ul className="space-y-3">
              {navigation?.links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-5 text-xs font-semibold tracking-wider uppercase">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="text-foreground mb-5 text-xs font-semibold tracking-wider uppercase">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`mailto:${contact_email}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{contact_email}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`tel:${contact_phone}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {contact_phone}
                </Link>
              </li>
              <h4 className="text-foreground mb-5 text-xs font-semibold tracking-wider uppercase">
                Address
              </h4>
              {location.map((loc) => (
                <li key={loc.id}>
                  <p className="text-muted-foreground text-xs">
                    <span className="text-foreground font-medium">
                      {loc.building}:{" "}
                    </span>
                    {loc.address}
                  </p>
                </li>
              ))}
              <li>
                <p className="text-muted-foreground text-xs">
                  <span className="text-foreground font-medium">
                    Open Hours:
                  </span>
                  <br />
                  {open_hours}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-accent-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white">{copyright}</p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-muted-foreground text-xs text-white transition-colors hover:underline"
              >
                Privacy &amp; Policy
              </Link>
              <span className="text-white/50">|</span>
              <Link
                href="/terms"
                className="hover:text-muted-foreground text-xs text-white transition-colors hover:underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
