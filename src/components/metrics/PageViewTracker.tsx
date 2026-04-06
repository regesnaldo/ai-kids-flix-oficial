"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackConversion } from "@/lib/metrics/conversion-client";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    void trackConversion({
      event: "page_view",
      path: pathname,
    });
  }, [pathname]);

  return null;
}
