"use client";

import { useState } from "react";

export default function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => { try { await navigator.clipboard.writeText(email); setOk(true); setTimeout(() => setOk(false), 2200); } catch {} }}
      className="btn btn-ghost w-full"
      aria-live="polite"
    >
      {ok ? `✓ ${done}` : label}
    </button>
  );
}
