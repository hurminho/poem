import { StudioSidebar } from "@/components/layout/studio-sidebar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid gap-10 md:grid-cols-[180px_1fr]">
        <aside className="md:sticky md:top-20 md:self-start">
          <StudioSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
