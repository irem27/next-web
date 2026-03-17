import type { Metadata } from "next";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = {
  title: "Grainfood GmbH – Logistik & Alamira Reis Großhandel",
  description:
    "Grainfood GmbH aus Deutschland: Zuverlässige Logistiklösungen und hochwertiger Alamira Reis im Großhandel. Effizient, schnell und europaweit geliefert.",
  keywords: [
    "Grainfood",
    "Alamira Reis",
    "Großhandel",
    "Logistik",
    "Spedition",
    "Basmati",
    "Sella Reis",
    "Deutschland",
    "Europa",
  ],
  openGraph: {
    title: "Grainfood GmbH – Logistik & Alamira Reis Großhandel",
    description:
      "Grainfood GmbH aus Deutschland: Zuverlässige Logistiklösungen und hochwertiger Alamira Reis im Großhandel. Effizient, schnell und europaweit geliefert.",
    type: "website",
    locale: "de_DE",
    siteName: "Grainfood GmbH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grainfood GmbH – Logistik & Alamira Reis Großhandel",
    description:
      "Grainfood GmbH aus Deutschland: Zuverlässige Logistiklösungen und hochwertiger Alamira Reis im Großhandel.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
