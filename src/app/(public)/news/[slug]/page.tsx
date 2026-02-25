import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import NewsDetailContent from "./NewsDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.logisticsNewsArticle.findFirst({
    where: { slug, isActive: true },
  });

  if (!article) return { title: "News Not Found" };

  return {
    title: `${article.title} | Logistics News`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      ...(article.image ? { images: [{ url: article.image, alt: article.imageAlt || article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.logisticsNewsArticle.findFirst({
    where: { slug, isActive: true },
  });

  if (!article) notFound();

  const relatedArticles = await prisma.logisticsNewsArticle.findMany({
    where: { isActive: true, id: { not: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <NewsDetailContent
      article={JSON.parse(JSON.stringify(article))}
      relatedArticles={JSON.parse(JSON.stringify(relatedArticles))}
    />
  );
}
