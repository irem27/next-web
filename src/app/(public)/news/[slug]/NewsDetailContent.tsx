"use client";

import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  imageAlt: string | null;
  author: string | null;
  publishedAt: string;
}

interface Props {
  article: Article;
  relatedArticles: Article[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsDetailContent({ article, relatedArticles }: Props) {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Hero */}
      <div className="relative bg-[#1a214f] overflow-hidden">
        {article.image && (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a214f]/60 via-[#1a214f]/80 to-[#1a214f]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#f06721] hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zu News
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-block bg-[#f06721] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              News
            </span>
            <time className="text-orange-200 text-sm" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.author && (
              <>
                <span className="text-[#f06721]">·</span>
                <span className="text-orange-200 text-sm">by {article.author}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/70 text-lg sm:text-xl mt-6 max-w-3xl leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Image */}
        {article.image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl -mt-20 sm:-mt-24 mb-12 sm:mb-16 border-4 border-white">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12">
          {article.content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#1a214f] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#f06721] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-[#1a214f]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#f06721]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#f06721]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">Bu haber için henüz içerik eklenmemiş.</p>
            </div>
          )}
        </article>

        {/* Share */}
        <div className="flex items-center gap-4 mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <span className="text-sm font-semibold text-[#1a214f]">Share:</span>
          <div className="flex gap-2">
            {[
              { label: "Twitter", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
              { label: "LinkedIn", icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
              { label: "Facebook", icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
            ].map((social) => (
              <button
                key={social.label}
                type="button"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent(article.title);
                  const shareUrls: Record<string, string> = {
                    Twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  };
                  window.open(shareUrls[social.label], "_blank", "width=600,height=400");
                }}
                className="w-10 h-10 bg-gray-50 hover:bg-[#f06721]/10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#f06721] transition-colors"
                aria-label={`Share on ${social.label}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{social.icon}</svg>
              </button>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a214f] mb-8">Ähnliche News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={ra.slug ? `/news/${ra.slug}` : "#"}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {ra.image && (
                    <div className="relative h-[160px] overflow-hidden">
                      <Image
                        src={ra.image}
                        alt={ra.imageAlt || ra.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <time className="text-xs text-gray-400 block mb-2">{formatDate(ra.publishedAt)}</time>
                    <h3 className="text-[#1a214f] text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#f06721] transition-colors">
                      {ra.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
