import type { Metadata } from "next";
import DrawerHeaderLayout from "./DrawerHeaderLayout";

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
    "Lebensmittelgroßhandel",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerHeaderLayout>
      {children}
    </DrawerHeaderLayout>
  );
}
