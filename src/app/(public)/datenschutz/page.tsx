import type { Metadata } from "next";
import DatenschutzContent from "./DatenschutzContent";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Cookie-Richtlinie",
  description: "Informationen zum Datenschutz, zur Verwendung von Cookies und Ihren Rechten gemäß DSGVO.",
};

export default function DatenschutzPage() {
  return <DatenschutzContent />;
}
