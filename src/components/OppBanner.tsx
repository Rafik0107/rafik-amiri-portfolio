import Link from "next/link";
import type { Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { oppHref, type OppDomain, type OppType } from "@/lib/opportunity";

/** Short "Have a project?" / "Hiring?" call to action opening the shared form with a preselected choice. */
export default function OppBanner({ lang, kind, type, domain, text }: { lang: Lang; kind: "hiring" | "project"; type?: OppType; domain?: OppDomain; text: string }) {
  const d = getDict(lang);
  return (
    <div className="no-print mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="glass gold-border reveal flex flex-col gap-5 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between md:p-9">
        <div>
          <p className="kicker">{kind === "hiring" ? d.cta.hiring : d.cta.project}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist md:text-base">{text}</p>
        </div>
        <Link href={oppHref(lang, { type, domain })} className="btn btn-gold shrink-0">{d.cta.opportunity} →</Link>
      </div>
    </div>
  );
}
