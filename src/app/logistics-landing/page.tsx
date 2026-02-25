import type { Metadata } from "next";
import LogisticsLandingPage from "../(public)/logistics-landing";
import DrawerHeaderLayout from "../(public)/DrawerHeaderLayout";

export const metadata: Metadata = {
  title:
    "Logi Craft | Crafting Your Logistics Success — Transport, Freight & Delivery Solutions",
  description:
    "Logi Craft delivers comprehensive logistics solutions across road, air, and sea. Track shipments in real-time, calculate costs, and experience world-class freight services for your business.",
  keywords: [
    "logistics",
    "freight services",
    "shipping",
    "transport solutions",
    "cargo delivery",
    "supply chain",
    "road transport",
    "air freight",
    "sea freight",
    "shipment tracking",
    "logistics company",
    "delivery solutions",
  ],
  openGraph: {
    title: "Logi Craft | Crafting Your Logistics Success",
    description:
      "Comprehensive logistics solutions for road, air, and sea transport. Track shipments, calculate costs, and discover efficient delivery services.",
    type: "website",
    locale: "en_US",
    siteName: "Logi Craft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logi Craft | Crafting Your Logistics Success",
    description:
      "Comprehensive logistics solutions for road, air, and sea transport.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/logistics-landing",
  },
};

export default function Page() {
  return (
    <DrawerHeaderLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Logi Craft",
            description:
              "Leading global logistics provider delivering comprehensive transport, freight, and supply chain solutions.",
            url: "https://logicraft.com",
            logo: "https://logicraft.com/logo.png",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+1-614-200-0000",
                contactType: "customer service",
                areaServed: "US",
              },
              {
                "@type": "ContactPoint",
                telephone: "+44-20-7946-0000",
                contactType: "customer service",
                areaServed: "GB",
              },
            ],
            sameAs: [
              "https://instagram.com/logicraft",
              "https://linkedin.com/company/logicraft",
              "https://twitter.com/logicraft",
              "https://youtube.com/@logicraft",
            ],
          }),
        }}
      />
      <LogisticsLandingPage />
    </DrawerHeaderLayout>
  );
}
