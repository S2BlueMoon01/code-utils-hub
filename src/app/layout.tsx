import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PerformanceMonitor } from "@/hooks/usePerformance";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/providers/I18nProvider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CodeUtilsHub",
    template: "%s | CodeUtilsHub"
  },
  description: "A modern platform for developers providing utility functions and code playground. Build better software with our curated collection of utilities.",
  keywords: ["utilities", "functions", "javascript", "typescript", "python", "playground", "development"],
  authors: [{ name: "CodeUtilsHub Team" }],
  creator: "CodeUtilsHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codeutilshub.com",
    title: "CodeUtilsHub",
    description: "A modern platform for developers providing utility functions and code playground.",
    siteName: "CodeUtilsHub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeUtilsHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeUtilsHub",
    description: "A modern platform for developers providing utility functions and code playground.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <PerformanceMonitor feature="app">
              <ErrorBoundary feature="app">
                <div className="flex min-h-screen flex-col bg-background">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ErrorBoundary>
            </PerformanceMonitor>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
