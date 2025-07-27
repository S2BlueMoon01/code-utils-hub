"use client";

import dynamic from "next/dynamic";

const CodePlayground = dynamic(() => import("@/components/CodePlayground"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-md border border-border bg-muted">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading playground...</p>
      </div>
    </div>
  ),
});

export default function PlaygroundWrapper() {
  return <CodePlayground />;
}
