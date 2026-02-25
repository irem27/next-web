import type { Metadata } from "next";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = {
  title: "IM Admin | Modern İçerik Yönetim Sistemi",
  description:
    "Profesyonel içerik yönetim sistemi. Web sitenizi kolayca yönetin, içeriklerinizi düzenleyin ve markanızı büyütün.",
  keywords: [
    "cms",
    "içerik yönetim",
    "admin panel",
    "web sitesi",
    "yönetim",
    "dashboard",
  ],
  openGraph: {
    title: "IM Admin | Modern İçerik Yönetim Sistemi",
    description:
      "Profesyonel içerik yönetim sistemi. Web sitenizi kolayca yönetin.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
