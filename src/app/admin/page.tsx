import { adminConfigured, isAdmin } from "@/lib/auth";
import { githubConfigured } from "@/lib/github";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="font-display text-3xl text-gold">Admin désactivé</h1>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          Le tableau de bord est désactivé tant que les variables d&apos;environnement <code>ADMIN_PASSWORD</code> et{" "}
          <code>ADMIN_SESSION_SECRET</code> (32 caractères minimum) ne sont pas définies sur Vercel. Voir le README.
        </p>
      </main>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;
  return <Dashboard canPublish={githubConfigured()} aiKey={Boolean(process.env.ANTHROPIC_API_KEY)} />;
}
