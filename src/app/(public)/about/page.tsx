import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "Hakkımızda | Alamira Rice - Hikayemiz",
  description:
    "Alamira Rice'ın hikayesini keşfedin. Organik pirinç üretiminde kalite ve dürüstlükle yıllardır hizmet veriyoruz. Saf pirinç, saf yaşam.",
  keywords: [
    "hakkımızda",
    "about us",
    "alamira",
    "hikaye",
    "organik pirinç",
    "basmati",
    "sella",
    "kalite",
    "tarım",
  ],
  openGraph: {
    title: "Hakkımızda | Alamira Rice",
    description:
      "Alamira Rice'ın hikayesini keşfedin. Kalite ve dürüstlükle üretilen organik pirinç.",
    type: "website",
    locale: "tr_TR",
    url: "/about",
    siteName: "Alamira Rice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda | Alamira Rice",
    description:
      "Alamira Rice'ın hikayesini keşfedin. Kalite ve dürüstlükle üretilen organik pirinç.",
  },
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Alamira Rice Hakkında",
  description: "Alamira Rice'ın hikayesi ve değerleri",
  url: "/about",
  mainEntity: {
    "@type": "Organization",
    name: "Alamira Rice",
    description: "Premium kalite Basmati ve Sella pirinç üreticisi",
    foundingDate: "2010",
    slogan: "Pure Rice, Pure Life",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageContent />
    </>
  );
}
