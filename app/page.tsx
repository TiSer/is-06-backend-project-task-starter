import { HomeLanding } from "@/components/home-landing";
import { PageShell } from "@/components/page-shell";

export default function HomePage() {
  return (
    <PageShell className="px-0 pt-0">
      <HomeLanding />
    </PageShell>
  );
}
