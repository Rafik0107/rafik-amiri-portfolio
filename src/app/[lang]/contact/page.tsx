import CopyEmail from "@/components/CopyEmail";
import OpportunityForm from "@/components/OpportunityForm";
import { PageHeader } from "@/components/ui";
import { portfolio, t } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { langOf, type PageProps } from "@/lib/page";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  return pageMeta(lang, "/contact", d.contact.title, d.contact.sub);
}

export default async function Contact({ params }: PageProps) {
  const lang = await langOf(params);
  const d = getDict(lang);
  const fr = lang === "fr";
  const { links } = portfolio.profile;
  const configured = !!process.env.RESEND_API_KEY;
  const domains = fr
    ? [["Automatique, robotique & mécatronique", "Mon cœur de formation : régulation, modélisation, estimation, systèmes embarqués."], ["Développement web & logiciel", "Applications web et outils Python, comme mon projet Smart Factory chez Wikeys."], ["Photographie & design graphique", "Prises de vue, retouche, visuels et identités pour des projets créatifs."]]
    : [["Control, robotics & mechatronics", "My core training: control, modelling, estimation, embedded systems."], ["Web & software development", "Web applications and Python tools, like my Smart Factory project at Wikeys."], ["Photography & graphic design", "Shoots, retouching, visuals and identities for creative projects."]];
  const channels = [
    { label: "Email", value: links.email, href: `mailto:${links.email}` },
    { label: fr ? "CV (PDF)" : "Resume (PDF)", value: fr ? "Télécharger" : "Download", href: t(portfolio.profile.cvPdf, lang) },
    { label: "GitHub", value: "Rafik0107", href: links.github },
    { label: "Carrd", value: "meinfewminites.carrd.co", href: links.carrd },
    { label: "Instagram", value: "@rf.raiden", href: links.instagram },
  ];

  return (
    <>
      <PageHeader kicker={d.contact.kicker} title={d.contact.title} intro={d.contact.sub} />
      <section id={fr ? "travaillons-ensemble" : "work-together"} className="mx-auto grid max-w-7xl scroll-mt-24 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" aria-labelledby="opp-title">
        <aside className="space-y-8">
          <h2 id="opp-title" className="reveal font-display text-2xl text-pearl md:text-3xl">{fr ? "Ce que je peux apporter" : "What I can bring"}</h2>
          <ol className="space-y-5">
            {domains.map(([h, p], i) => (
              <li key={h} className="reveal border-t border-gold/25 pt-4" data-delay={String(i * 0.06)}>
                <p className="text-[0.65rem] tracking-[0.3em] text-purple-soft">0{i + 1}</p>
                <p className="mt-1 font-display text-lg text-gold">{h}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">{p}</p>
              </li>
            ))}
          </ol>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {channels.map((c, i) => (
              <li key={c.label} className="reveal" data-delay={String(i * 0.05)}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="glass card-lift group flex items-center justify-between rounded-2xl px-5 py-4 hover:border-gold/60">
                  <span>
                    <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-mist">{c.label}</span>
                    <span className="mt-1 block text-sm text-pearl transition-colors group-hover:text-gold">{c.value}</span>
                  </span>
                  <span className="text-gold" aria-hidden>↗</span>
                </a>
              </li>
            ))}
            <li className="reveal"><CopyEmail email={links.email} label={d.contact.copy} done={d.contact.copied} /></li>
          </ul>
          <p className="reveal text-sm text-mist">Paris, France</p>
        </aside>
        <div className="reveal"><OpportunityForm lang={lang} email={links.email} configured={configured} /></div>
      </section>
    </>
  );
}
