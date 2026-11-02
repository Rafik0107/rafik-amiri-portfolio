"use client";

export default function PrintButton({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <button
      onClick={() => window.print()}
      className={primary
        ? "rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-void hover:bg-gold-bright"
        : "rounded-full border border-gold/50 px-6 py-3 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-void"}
    >
      {label}
    </button>
  );
}
