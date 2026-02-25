"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SectionData = { id: string; title: string; description: string };

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  author: string;
  link: string;
  order: number;
};

const EMPTY_ARTICLE: ArticleItem = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  imageAlt: "",
  author: "",
  link: "",
  order: 0,
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function LogisticsNewsAdmin() {
  const [section, setSection] = useState<SectionData | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [editing, setEditing] = useState<ArticleItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logistics/news");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSection({
        id: data.section.id,
        title: data.section.title ?? "",
        description: data.section.description ?? "",
      });
      setArticles(
        (data.articles ?? []).map((a: Record<string, unknown>) => ({
          id: a.id ?? "",
          title: (a.title as string) ?? "",
          slug: (a.slug as string) ?? "",
          excerpt: (a.excerpt as string) ?? "",
          content: (a.content as string) ?? "",
          image: (a.image as string) ?? "",
          imageAlt: (a.imageAlt as string) ?? "",
          author: (a.author as string) ?? "",
          link: (a.link as string) ?? "",
          order: (a.order as number) ?? 0,
        }))
      );
    } catch {
      toast.error("Veriler alınamadı!");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!section) return;
    setSection({ ...section, [e.target.name]: e.target.value });
  };

  const saveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logistics/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "section", ...section }),
      });
      if (!res.ok) throw new Error();
      toast.success("Bölüm kaydedildi!");
    } catch {
      toast.error("Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const title = e.target.value;
    const updates: Partial<ArticleItem> = { title };
    if (!editing.id || !editing.slug) {
      updates.slug = generateSlug(title);
    }
    setEditing({ ...editing, ...updates });
  };

  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || loading) return;
    setLoading(true);
    try {
      let imageUrl = editing.image;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "logistics");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData?.url) imageUrl = uploadData.url;
        }
      }

      const res = await fetch("/api/admin/logistics/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "article", ...editing, image: imageUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success(editing.id ? "Güncellendi!" : "Oluşturuldu!");
      setEditing(null);
      setFile(null);
      await fetchData();
    } catch {
      toast.error("Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/logistics/news?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Silindi!");
      await fetchData();
    } catch {
      toast.error("Silme başarısız!");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const inputClass = "border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Latest News Yönetimi</h2>
        <p className="text-slate-500 text-sm mt-1">Haber kartlarını ve bölüm başlığını buradan yönetin.</p>
      </div>

      {/* Section Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Bölüm Başlığı</h3>
        <form onSubmit={saveSection} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="sec-title">Başlık</label>
            <input id="sec-title" name="title" value={section?.title ?? ""} onChange={handleSectionChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="sec-desc">Açıklama</label>
            <textarea id="sec-desc" name="description" value={section?.description ?? ""} onChange={handleSectionChange} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors w-fit">
            {loading ? "Kaydediliyor..." : "Başlığı Kaydet"}
          </button>
        </form>
      </div>

      {/* Articles List */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Haber Kartları</h3>
        <button type="button" onClick={() => setEditing({ ...EMPTY_ARTICLE, order: articles.length })} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          + Yeni Haber
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {article.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.image} alt={article.imageAlt || ""} className="w-16 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900 truncate max-w-md">{article.title}</h4>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-slate-400">Sıra: {article.order}</span>
                  {article.slug && (
                    <span className="text-xs text-blue-500 font-mono">/news/{article.slug}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button type="button" onClick={() => setEditing({ ...article })} className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors">
                Düzenle
              </button>
              <button type="button" onClick={() => deleteArticle(article.id)} className="text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors">
                Sil
              </button>
            </div>
          </div>
        ))}
        {articles.length === 0 && <p className="text-center text-slate-400 py-10">Henüz haber eklenmemiş.</p>}
      </div>

      {/* Edit / Create Article Form */}
      {editing && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            {editing.id ? "Haberi Düzenle" : "Yeni Haber Ekle"}
          </h3>
          <form onSubmit={saveArticle} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-title">Başlık</label>
              <input id="art-title" name="title" value={editing.title} onChange={handleTitleChange} placeholder="Haber başlığı..." className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-slug">
                Slug (URL)
                {editing.slug && <span className="text-xs text-blue-500 ml-2 font-normal">/news/{editing.slug}</span>}
              </label>
              <input id="art-slug" name="slug" value={editing.slug} onChange={handleArticleChange} placeholder="haber-basligi" className={`${inputClass} font-mono text-sm`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-excerpt">Özet</label>
              <textarea id="art-excerpt" name="excerpt" value={editing.excerpt} onChange={handleArticleChange} rows={2} placeholder="Haberin kısa özeti..." className={`${inputClass} resize-none`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-content">
                İçerik <span className="text-xs text-slate-400 font-normal">(HTML desteklenir)</span>
              </label>
              <textarea id="art-content" name="content" value={editing.content} onChange={handleArticleChange} rows={10} placeholder="<p>Haber içeriği...</p>" className={`${inputClass} resize-y font-mono text-sm`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-file">Görsel Yükle</label>
              <input id="art-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="border border-slate-300 rounded-lg p-2 text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-900 hover:file:bg-slate-200" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-image">veya Görsel URL</label>
              <input id="art-image" name="image" value={editing.image} onChange={handleArticleChange} placeholder="https://images.unsplash.com/..." className={inputClass} />
            </div>

            {editing.image && !file && (
              <div>
                <span className="text-xs text-slate-500 mb-1 block">Mevcut görsel:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.image} alt={editing.imageAlt || ""} className="w-full max-h-40 object-cover rounded-lg border" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="art-imgalt">Görsel Alt Metin</label>
              <input id="art-imgalt" name="imageAlt" value={editing.imageAlt} onChange={handleArticleChange} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="art-author">Yazar</label>
                <input id="art-author" name="author" value={editing.author} onChange={handleArticleChange} placeholder="Yazar adı" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="art-link">Harici Link (opsiyonel)</label>
                <input id="art-link" name="link" value={editing.link} onChange={handleArticleChange} placeholder="Boş bırakılırsa detay sayfasına yönlendirir" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="art-order">Sıra</label>
                <input id="art-order" name="order" type="number" value={editing.order} onChange={handleArticleChange} className={inputClass} />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors">
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button type="button" onClick={() => { setEditing(null); setFile(null); }} className="border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg px-6 py-2.5 font-medium transition-colors">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
