"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { localAnswer } from "@/lib/assistant";

type Msg = { role: "user" | "assistant"; content: string };

export default function RaidenAI({ lang }: { lang: Lang }) {
  const d = getDict(lang).ai;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "local" | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const next = [...msgs, { role: "user" as const, content: question }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next, lang }) });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error();
      setMode(data.mode);
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      // Network or server unavailable: answer locally from the same verified data.
      setMode("local");
      setMsgs((m) => [...m, { role: "assistant", content: localAnswer(question, lang) }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print fixed bottom-5 right-5 z-[70]">
      {open && (
        <section
          role="dialog"
          aria-label={d.title}
          className="glass gold-border absolute bottom-20 right-0 flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl shadow-[0_20px_80px_rgba(123,47,255,0.35)]"
        >
          <header className="flex items-center justify-between border-b border-pearl/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="relative h-7 w-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e9dcff,#7b2fff_45%,#1a0840)] shadow-[0_0_18px_#7b2fff]" />
              <div>
                <p className="font-display text-sm tracking-[0.3em] text-gold">{d.title}</p>
                <p className="text-[0.65rem] text-mist">{mode === "local" ? d.local : "Portfolio · FR / EN"}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full px-2 text-xl text-mist hover:text-pearl" aria-label={getDict(lang).close}>×</button>
          </header>
          <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-purple/15 px-4 py-3 text-pearl/90">{d.hello}</p>
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 ${m.role === "user" ? "ml-auto rounded-tr-sm bg-gold/90 text-void" : "rounded-tl-sm bg-purple/15 text-pearl/90"}`}
              >
                {m.content}
              </p>
            ))}
            {busy && <p className="w-16 animate-pulse rounded-2xl bg-purple/15 px-4 py-3 tracking-widest text-gold">•••</p>}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {d.suggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold transition hover:bg-gold hover:text-void">{s}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-pearl/10 p-3">
            <label className="sr-only" htmlFor="raiden-ai-input">{d.placeholder}</label>
            <input
              id="raiden-ai-input"
              ref={inputRef}
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder={d.placeholder}
              className="flex-1 rounded-full border border-pearl/15 bg-void/60 px-4 py-2.5 text-sm text-pearl placeholder:text-mist/70 focus:border-gold/60 focus:outline-none"
            />
            <button disabled={busy || !input.trim()} className="rounded-full bg-gold px-4 text-sm font-semibold text-void transition hover:bg-gold-bright disabled:opacity-40">{d.send}</button>
          </form>
        </section>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={d.open}
        aria-expanded={open}
        className="group relative grid h-16 w-16 place-items-center"
      >
        <span className="absolute inset-0 animate-[spin-ring_9s_linear_infinite] rounded-full border border-dashed border-gold/50" />
        <span className="absolute inset-1.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f1e8ff,#a978ff_25%,#7b2fff_50%,#1a0840_85%)] shadow-[0_0_30px_rgba(123,47,255,0.9),inset_0_0_14px_rgba(255,215,0,0.45)] transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute -right-0.5 top-1 h-2 w-2 animate-ping rounded-full bg-gold-bright" />
        <span className="relative font-display text-[0.6rem] tracking-[0.15em] text-pearl">AI</span>
      </button>
    </div>
  );
}
