import type { Metadata } from "next";
import DrawerHeaderLayout from "./DrawerHeaderLayout";

export const metadata: Metadata = {
  title: "Imperial Grainfood | Premium Rice & Logistics",
  description:
    "Alamira Premium Rice Specialties & Grainfood Transport, Freight & Logistics Services",
  keywords: [
    "basmati rice",
    "sella rice",
    "premium rice",
    "alamira",
    "grainfood",
    "logistics",
    "transport",
    "freight",
  ],
  openGraph: {
    title: "Imperial Grainfood | Premium Rice & Logistics",
    description:
      "Alamira Premium Rice Specialties & Grainfood Transport, Freight & Logistics Services",
    type: "website",
    locale: "en_US",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <DrawerHeaderLayout>
      {children}
    </DrawerHeaderLayout>
  );
}
