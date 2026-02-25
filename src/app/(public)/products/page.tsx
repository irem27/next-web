import type { Metadata } from "next";
import ProductsListContent from "./ProductsListContent";

export const metadata: Metadata = {
  title: "Ürünler | Alamira Rice - Premium Basmati & Sella Pirinç",
  description:
    "Alamira Rice premium kalite ürünleri. Basmati, Sella ve organik pirinç çeşitlerimizi keşfedin. Saf pirinç, saf yaşam.",
  keywords: [
    "ürünler",
    "products",
    "basmati pirinç",
    "sella pirinç",
    "organik pirinç",
    "premium pirinç",
    "alamira",
    "rice",
  ],
  openGraph: {
    title: "Ürünler | Alamira Rice",
    description:
      "Premium kalite Basmati ve Sella pirinç çeşitlerimizi keşfedin.",
    type: "website",
    locale: "tr_TR",
    url: "/products",
    siteName: "Alamira Rice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ürünler | Alamira Rice",
    description:
      "Premium kalite Basmati ve Sella pirinç çeşitlerimizi keşfedin.",
  },
  alternates: {
    canonical: "/products",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Alamira Rice Ürünleri",
  description: "Premium kalite Basmati ve Sella pirinç ürünleri",
  url: "/products",
  provider: {
    "@type": "Organization",
    name: "Alamira Rice",
  },
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsListContent />
    </>
  );
}
