type Endpoint = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: string;
  status: "ready" | "todo";
};

const ENDPOINTS: readonly Endpoint[] = [
  { method: "GET", path: "/api/health", auth: "public", status: "ready" },
  { method: "POST", path: "/api/auth/sign-up/email", auth: "public", status: "ready" },
  { method: "POST", path: "/api/auth/sign-in/email", auth: "public", status: "ready" },
  { method: "POST", path: "/api/auth/sign-out", auth: "session", status: "ready" },
  { method: "GET", path: "/api/v1/<your-resource>", auth: "optional", status: "todo" },
  { method: "POST", path: "/api/v1/<your-resource>", auth: "session", status: "todo" },
  { method: "GET", path: "/api/v1/<your-resource>/:id", auth: "optional", status: "todo" },
  { method: "PATCH", path: "/api/v1/<your-resource>/:id", auth: "session + owner", status: "todo" },
  { method: "DELETE", path: "/api/v1/<your-resource>/:id", auth: "session + admin", status: "todo" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-400/80">
          is-06-backend-project-task-starter
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Backend Workflow 2026 — homework starter
        </h1>
        <p className="text-lg leading-7 text-neutral-300">
          A Next.js 16 + Neon + Drizzle + Better Auth + Zod scaffold. Auth is
          wired, the database adapter is wired, the health probe works. Your
          job is to design a small domain (one resource, owner-only mutations),
          implement it with AI as your junior engineer, and prove correctness
          with Vitest + CI.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
        <h2 className="text-xl font-semibold">Endpoints checklist</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th className="py-2 pr-4 font-medium">Method</th>
                <th className="py-2 pr-4 font-medium">Path</th>
                <th className="py-2 pr-4 font-medium">Auth</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-neutral-200">
              {ENDPOINTS.map((e) => (
                <tr key={`${e.method} ${e.path}`} className="border-t border-neutral-800/60">
                  <td className="py-2 pr-4 font-mono text-emerald-300">{e.method}</td>
                  <td className="py-2 pr-4 font-mono">{e.path}</td>
                  <td className="py-2 pr-4 text-neutral-400">{e.auth}</td>
                  <td className="py-2">
                    {e.status === "ready" ? (
                      <span className="text-emerald-300">ready</span>
                    ) : (
                      <span className="text-amber-300">TODO</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-2 text-sm text-neutral-400">
        <p>
          Start with <code className="font-mono text-neutral-200">README.md</code>{" "}
          and <code className="font-mono text-neutral-200">AGENTS.md</code>.
          Fill in <code className="font-mono text-neutral-200">docs/prd.md</code>{" "}
          and <code className="font-mono text-neutral-200">docs/ARCHITECTURE.md</code>{" "}
          before writing code.
        </p>
        <p>
          Reference implementation:{" "}
          <a className="text-neutral-100 underline" href="https://github.com/koldovsky/is-06-backend-project">
            koldovsky/is-06-backend-project
          </a>
        </p>
      </section>
    </main>
  );
}
