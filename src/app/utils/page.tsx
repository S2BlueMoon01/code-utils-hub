import type { Metadata } from "next";
import UtilsLibrary from "@/components/UtilsLibrary";

export const metadata: Metadata = {
  title: "Utility Functions Library | CodeUtils Hub",
  description: "Discover and explore a comprehensive collection of utility functions for JavaScript, TypeScript, and Python. All functions are tested, documented, and ready to use.",
  keywords: ["utility functions", "javascript utilities", "typescript utilities", "python utilities", "code library", "developer tools"],
  openGraph: {
    title: "Utility Functions Library | CodeUtils Hub",
    description: "Comprehensive collection of utility functions for developers",
    url: "/utils",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utility Functions Library | CodeUtils Hub",
    description: "Comprehensive collection of utility functions for developers",
  },
};

export default function UtilsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <UtilsLibrary />
      </div>
    </div>
  );
}
