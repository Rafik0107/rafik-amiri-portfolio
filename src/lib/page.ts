import { notFound } from "next/navigation";
import { isLang, type Lang } from "./content";

export type PageProps = { params: Promise<{ lang: string }> };

export async function langOf(params: PageProps["params"]): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}
