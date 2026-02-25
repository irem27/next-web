import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "İletişim | Alamira Rice - Bize Ulaşın",
  description:
    "Alamira Rice ile iletişime geçin. Sorularınız, önerileriniz veya işbirliği teklifleriniz için ekibimizle görüşün. 7/24 destek hattımız ile yanınızdayız.",
  keywords: [
    "iletişim",
    "contact",
    "alamira",
    "pirinç",
    "rice",
    "destek",
    "müşteri hizmetleri",
    "adres",
    "telefon",
    "e-posta",
  ],
  openGraph: {
    title: "İletişim | Alamira Rice",
    description:
      "Alamira Rice ile iletişime geçin. Ekibimiz size yardımcı olmaktan mutluluk duyar.",
    type: "website",
    locale: "tr_TR",
    url: "/contact",
    siteName: "Alamira Rice",
  },
  twitter: {
    card: "summary_large_image",
    title: "İletişim | Alamira Rice",
    description:
      "Alamira Rice ile iletişime geçin. Ekibimiz size yardımcı olmaktan mutluluk duyar.",
  },
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Alamira Rice İletişim",
  description: "Alamira Rice ile iletişime geçin",
  mainEntity: {
    "@type": "Organization",
    name: "Alamira Rice",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "(000)-000-0000",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageContent />
    </>
  );
}
