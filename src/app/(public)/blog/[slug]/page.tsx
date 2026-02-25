"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: string;
  date: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          setError("Blog yazısı bulunamadı");
        }
      } catch (err) {
        console.error("Blog fetch error:", err);
        setError("Blog yazısı yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#868792]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#f4f4f4] flex flex-col items-center justify-center px-4 py-32">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || "Blog yazısı bulunamadı"}
        </h1>
        <Link
          href="/"
          className="text-[#868792] hover:text-[#6e6f7a] font-medium"
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f4]">
      {/* Hero Image */}
      {post.image && (
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#868792] hover:text-[#6e6f7a] font-medium mb-8"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Ana Sayfaya Dön
        </Link>

        {/* Title & Meta */}
        <article>
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0c0f23] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#868792] flex items-center justify-center text-white font-medium">
                  {post.author[0].toUpperCase()}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <span className="text-gray-400">•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </header>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          {post.content && (
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#0c0f23] prose-p:text-gray-700 prose-a:text-[#868792] prose-strong:text-[#0c0f23] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bu yazıyı paylaş
          </h3>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                post.title +
                  " " +
                  (typeof window !== "undefined" ? window.location.href : "")
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
