import HeaderLogo from "./header-logo";
import HeaderNavigation from "./header-navigation";
import HeaderUserAction from "./header-user-action";
import HeaderMenu from "./header-menu";
import LanguageSwitcher from "./language-switcher";
import type { StrapiLogo, StrapiNavigationLink } from "@/types/global";

interface HeaderProps {
  logo: StrapiLogo[];
  siteName: string;
  links: StrapiNavigationLink[];
}

export default function Header({ logo, siteName, links }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/70 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-10">
            <HeaderLogo logo={logo} siteName={siteName} />
            <div className="hidden md:block">
              <HeaderNavigation
                links={links}
                className="flex items-center gap-8"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <HeaderUserAction className="hidden items-center gap-2 md:flex" />

            <HeaderMenu>
              <HeaderNavigation links={links} className="flex flex-col gap-4" />
              <HeaderUserAction className="flex flex-col gap-3 pt-4" />
            </HeaderMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
