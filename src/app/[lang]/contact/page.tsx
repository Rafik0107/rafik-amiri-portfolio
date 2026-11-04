import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import { PageHeader } from "@/components/ui";
import { portfolio } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  return pageMeta(lang, "/contact", d.nav.contact, d.contact.sub);
}

export default async function Contact({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const { links } = portfolio.profile;
  const channels = [
    { label: "Email", value: links.email, href: `mailto:${links.email}` },
    { label: "GitHub", value: "Rafik0107", href: links.github },
    { label: "Instagram", value: "@rf.raiden", href: links.instagram },
    { label: "Carrd", value: "meinfewminites.carrd.co", href: links.carrd },
  ];
  return (
    <>
      <PageHeader kicker={d.nav.contact} title={d.contact.title} intro={d.contact.sub} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-[1fr_360px]">
        <div className="reveal"><ContactForm lang={lang} email={links.email} /></div>
        <ul className="space-y-4">
          {channels.map((c, i) => (
            <li key={c.label} className="reveal" data-delay={String(i * 0.06)}>
              <Link href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="glass card-lift group flex items-center justify-between rounded-2xl p-5 hover:border-gold/60">
                <span>
                  <span className="block text-xs uppercase tracking-[0.3em] text-mist">{c.label}</span>
                  <span className="mt-1 block text-pearl transition group-hover:text-gold">{c.value}</span>
                </span>
                <span className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </Link>
            </li>
          ))}
          <li className="reveal"><CopyEmail email={links.email} label={d.contact.copy} done={d.contact.copied} /></li>
          <li className="reveal rounded-2xl border border-purple/30 p-5 text-sm text-mist">Paris, France</li>
        </ul>
      </div>
    </>
  );
}
