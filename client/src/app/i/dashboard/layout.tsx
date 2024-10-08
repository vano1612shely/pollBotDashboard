import Menu from "@/components/Menu";
import { ReactNode } from "react";
import { SocketProvider } from "@/providers/socketProvider";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Menu />
        <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 pt-20 md:p-10">
          {children}
        </div>
      </div>
    </SocketProvider>
  );
}
