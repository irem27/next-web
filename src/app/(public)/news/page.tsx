import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import NewsListContent from "./NewsListContent";

export const metadata: Metadata = {
  title: "News | Logistics",
  description: "Alle Neuigkeiten und Updates aus dem Bereich Logistik.",
};

export default async function NewsPage() {
  const section = await prisma.logisticsNewsSection.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const articles = await prisma.logisticsNewsArticle.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <NewsListContent
      section={section ? JSON.parse(JSON.stringify(section)) : null}
      articles={JSON.parse(JSON.stringify(articles))}
    />
  );
}

