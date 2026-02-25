import type { Metadata } from "next";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import ProductsSection from "@/components/public/ProductsSection";
import InstagramSection from "@/components/public/InstagramSection";
import BlogSection from "@/components/public/BlogSection";

export const metadata: Metadata = {
  title: "Alamira Rice | Premium Basmati & Sella Rice",
  description:
    "Premium quality Basmati and Sella rice. Pure Rice, Pure Life - Experience the finest rice grown with integrity and love.",
  keywords: [
    "alamira",
    "rice",
    "basmati",
    "sella",
    "premium rice",
    "organic rice",
    "quality rice",
  ],
  openGraph: {
    title: "Alamira Rice | Premium Basmati & Sella Rice",
    description:
      "Premium quality Basmati and Sella rice. Pure Rice, Pure Life.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function AlamiraRicePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection siteKey="alamira" />
      <ProductsSection />
      <InstagramSection />
      <BlogSection />
    </main>
  );
}
