"use client";

import Image from "next/image";
import Link from "next/link";

type NewsSection = {
  title: string;
  description: string;
} | null;

type NewsArticle = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  image: string | null;
  imageAlt: string | null;
  link: string | null;
  author: string | null;
  publishedAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsListContent({
  section,
  articles,
}: {
  section: NewsSection;
  articles: NewsArticle[];
}) {
  return (
    <main className="min-h-screen bg-[#f4f4f4]">
      {/* Hero */}
      <section className="relative bg-[#1a214f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a214f] via-[#24306a] to-[#1a214f]" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-14 sm:pb-16">
          <Link
            href="/logistics-landing"
            className="inline-flex items-center gap-2 text-[#f06721] hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zu Logistics
          </Link>

          <div className="max-w-2xl">
            <p className="text-[#f06721] text-xs sm:text-sm font-medium tracking-widest uppercase mb-4">
              News
            </p>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              {section?.title || "Alle News"}
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              {section?.description ||
                "Aktuelle Updates und Einblicke rund um Transport, Spedition und Supply-Chain."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1320px] mx-auto">
          {articles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#f06721]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#1a214f] mb-2">Noch keine News</h2>
              <p className="text-gray-500">
                Sobald neue Beiträge veröffentlicht werden, erscheinen sie hier automatisch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {articles.map((article) => {
                const href = article.slug ? `/news/${article.slug}` : (article.link || "#");
                const isExternal = !article.slug && !!article.link && /^https?:\/\//.test(article.link);

                return (
                  <article
                    key={article.id}
                    className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {article.image && (
                      <div className="relative h-[210px] overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.imageAlt ?? article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      </div>
                    )}

                    <div className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                        <span className="inline-flex items-center bg-[#f06721]/10 text-[#f06721] px-2.5 py-1 rounded-full font-semibold">
                          Logistics
                        </span>
                        <time className="text-gray-400" dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt)}
                        </time>
                        {article.author && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-gray-400">{article.author}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-[#1a214f] text-base sm:text-lg font-extrabold leading-snug line-clamp-3 group-hover:text-[#f06721] transition-colors">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed mt-3 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-[#f06721] text-sm font-semibold mt-5 hover:gap-2.5 transition-all"
                      >
                        Mehr lesen
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

