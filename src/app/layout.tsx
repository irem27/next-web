import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getSettings() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:5001";
    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const favicon = settings?.favicon ?? null;

  return {
    title: "Grainfood GmbH – Logistik & Alamira Reis Großhandel",
    description:
      "Grainfood GmbH aus Deutschland: Zuverlässige Logistiklösungen und hochwertiger Alamira Reis im Großhandel. Effizient, schnell und europaweit geliefert.",
    icons: favicon
      ? {
          icon: favicon,
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
