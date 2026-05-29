export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  name: string;
  alternativeText: string | null;
  width?: number | null;
  height?: number | null;
}

export interface StrapiButton {
  id: number;
  text: string;
  href: string;
  button_style: "Text" | "Filled" | "Ghost" | "Shaded";
  color: string | null;
}

export interface StrapiLocation {
  id: number;
  building: "Headquater" | "Branch";
  address: string;
}

export interface StrapiSocialMedia {
  id: number;
  platform: string;
  url: string;
  icon: StrapiMedia;
}

export interface StrapiLogo {
  id: number;
  name: string;
  icon: StrapiMedia;
}

export interface StrapiNavigationLink {
  id: number;
  name: string;
  href: string;
}

export interface StrapiNavigation {
  id: number;
  title: string;
  links: StrapiNavigationLink[];
}

export interface StrapiCtaBlock {
  id: number;
  title: string;
  description: string;
  bg_color: string | null;
  image: StrapiMedia | null;
  cta: StrapiButton;
}

export interface GlobalData {
  id: number;
  documentId: string;
  siteName: string;
  description: string;
  copyright: string;
  contact_email: string;
  contact_phone: string;
  open_hours: string;
  auth_background: StrapiMedia;
  location: StrapiLocation[];
  SocialMedia: StrapiSocialMedia[];
  cta_block: StrapiCtaBlock;
  navigation: StrapiNavigation | null;
  logo: StrapiLogo[];
}

export interface GlobalResponse {
  data: GlobalData;
  meta: Record<string, unknown>;
}
