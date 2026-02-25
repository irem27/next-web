import type { Metadata } from "next";
import ImpressumContent from "./ImpressumContent";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung.",
};

export default function ImpressumPage() {
  return <ImpressumContent />;
}

