import type { Metadata } from "next";
import PlaygroundWrapper from "@/components/PlaygroundWrapper";

export const metadata: Metadata = {
  title: "Code Playground | CodeUtils Hub",
  description: "Interactive code playground supporting JavaScript, TypeScript, Python, HTML, and CSS. Write, run, and experiment with code in your browser.",
  keywords: ["code playground", "online editor", "javascript", "typescript", "python", "html", "css", "monaco editor"],
  openGraph: {
    title: "Code Playground | CodeUtils Hub",
    description: "Interactive code playground supporting multiple programming languages",
    url: "/playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Playground | CodeUtils Hub",
    description: "Interactive code playground supporting multiple programming languages",
  },
};

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <PlaygroundWrapper />
      </div>
    </div>
  );
}
