"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

export function LayoutPicker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemo = pathname?.startsWith("/demo");

  if (isDemo) {
    return <>{children}</>;
  }
  return <AppShell>{children}</AppShell>;
}
