import { getGlobal } from "@/services/global.api";
import { type Locale } from "@/i18n/routing";
import Header from "@/components/common/header";
import CtaBlock from "@/components/common/cta-block";
import Footer from "@/components/common/footer";
import ChatAssistant from "@/components/ai-assit/ai-chatbox";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const global = await getGlobal(locale);
  const { data } = global;

  return (
    <>
      <Header
        logo={data.logo}
        siteName={data.siteName}
        links={data.navigation?.links ?? []}
      />
      {children}
      <CtaBlock cta_block={data.cta_block} />
      <Footer
        logo={data.logo}
        siteName={data.siteName}
        SocialMedia={data.SocialMedia}
        location={data.location}
        navigation={data.navigation}
        open_hours={data.open_hours}
        contact_email={data.contact_email}
        contact_phone={data.contact_phone}
        copyright={data.copyright}
      />
      <ChatAssistant />
    </>
  );
}
