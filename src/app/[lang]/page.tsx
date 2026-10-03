import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import Education from "@/components/education";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import TranslationNotice from "@/components/translation-notice";
import HireToast from "@/components/hire-toast";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main id="main-content" className="flex-1">
        <Hero dict={dict} />
        <Experience t={dict.experience} sep={dict.common.separator} />
        <Projects t={dict.projects} />
        <Skills t={dict.skills} />
        <Education t={dict.education} sep={dict.common.separator} />
        <Contact t={dict.contact} common={dict.common} />
      </main>
      <Footer locale={locale} dict={dict} />
      {locale !== defaultLocale && <TranslationNotice locale={locale} t={dict.language} />}
      <HireToast t={dict.hire} />
    </>
  );
}
