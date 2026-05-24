import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { RecordsTabs } from "@/components/records-tabs";
import { tracks } from "@/lib/data";

export default function RecordsPage() {
  return (
    <PageShell>
      <div className="flex flex-1 flex-col">
        <PageHeader
          title="Track Records"
          description="Personal bests and session history across every circuit you ride."
        />
        <RecordsTabs tracks={tracks} />
      </div>
    </PageShell>
  );
}
