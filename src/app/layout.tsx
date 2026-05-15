import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCatalog } from "@/lib/catalog/loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const catalog = getCatalog();
const p = catalog.metadata.paleta;

const themeStyle = `:root {
  --bg: ${p.background};
  --surface: ${p.surface};
  --primary: ${p.primary};
  --primary-dim: ${p.secondary};
  --accent: ${p.accent};
}`;

export const metadata: Metadata = {
  title: `${catalog.metadata.titulo_painel} — Bravy`,
  description: catalog.metadata.descricao,
  applicationName: catalog.metadata.titulo_painel,
  authors: [{ name: "Bravy / ASV Digital", url: "https://asv.digital" }],
  keywords: [
    "escritório virtual",
    "agentes",
    "ia",
    catalog.nicho,
    "bravy",
    "asv digital",
  ],
};

export const viewport: Viewport = {
  themeColor: catalog.metadata.paleta.background,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-nicho={catalog.nicho}
      data-tom={catalog.metadata.tom}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </body>
    </html>
  );
}
