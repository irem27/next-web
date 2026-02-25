import type { Metadata } from "next";
import BlogListContent from "./BlogListContent";

export const metadata: Metadata = {
  title: "Blog | Alamira Rice - Tarifler ve Hikayeler",
  description:
    "Alamira Rice blog sayfası. Pirinç tarifleri, organik tarım hikayeleri, sağlıklı yaşam ipuçları ve daha fazlası.",
  keywords: [
    "blog",
    "tarifler",
    "recipes",
    "pirinç tarifleri",
    "rice recipes",
    "organik",
    "sağlıklı yaşam",
    "alamira",
  ],
  openGraph: {
    title: "Blog | Alamira Rice",
    description:
      "Pirinç tarifleri, organik tarım hikayeleri ve sağlıklı yaşam ipuçları.",
    type: "website",
    locale: "tr_TR",
    url: "/blog",
    siteName: "Alamira Rice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Alamira Rice",
    description:
      "Pirinç tarifleri, organik tarım hikayeleri ve sağlıklı yaşam ipuçları.",
  },
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Alamira Rice Blog",
  description: "Pirinç tarifleri, organik tarım hikayeleri ve sağlıklı yaşam ipuçları",
  url: "/blog",
  publisher: {
    "@type": "Organization",
    name: "Alamira Rice",
  },
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListContent />
    </>
  );
}
