import type { Metadata } from "next";
import CookiesContent from "./CookiesContent";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Cookie-Richtlinie und Cookie-Einstellungen.",
};

export default function CookiesPage() {
  return <CookiesContent />;
}

