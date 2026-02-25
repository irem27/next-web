"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: string;
  date: string;
  featured: boolean;
  isActive: boolean;
}

interface SectionSettings {
  id: string;
  badgeText: string;
  title: string;
  description: string | null;
  buttonText: string;
  buttonLink: string;
}

export default function BlogPage() {
  const [section, setSection] = useState<SectionSettings | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Edit post modal
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setSection(data.section);
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });

      if (res.ok) {
        setMessage("Section ayarları kaydedildi!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("Kaydetme hatası!");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPostForm((prev) => ({ ...prev, image: data.url }));
        return data.url;
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return null;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openNewPostModal = () => {
    setEditingPost(null);
    setPostForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      author: "Admin",
      featured: false,
    });
    setShowPostModal(true);
  };

  const openEditPostModal = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      author: post.author,
      featured: post.featured,
    });
    setShowPostModal(true);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPost) {
        // Update
        const res = await fetch("/api/admin/blog", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPost.id, ...postForm }),
        });

        if (res.ok) {
          setMessage("Yazı güncellendi!");
          fetchData();
        } else {
          const data = await res.json();
          setMessage(data.error || "Güncelleme hatası!");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postForm),
        });

        if (res.ok) {
          setMessage("Yeni yazı eklendi!");
          fetchData();
        } else {
          const data = await res.json();
          setMessage(data.error || "Ekleme hatası!");
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("Kaydetme hatası!");
    } finally {
      setSaving(false);
      setShowPostModal(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("Yazı silindi!");
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, featured: !post.featured }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A853]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Blog / Tarifler</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("hata") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      {/* Section Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Section Ayarları</h2>
        
        <form onSubmit={handleSectionSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={section?.badgeText || ""}
                onChange={(e) => setSection((s) => s ? { ...s, badgeText: e.target.value } : s)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={section?.title || ""}
                onChange={(e) => setSection((s) => s ? { ...s, title: e.target.value } : s)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={section?.description || ""}
              onChange={(e) => setSection((s) => s ? { ...s, description: e.target.value } : s)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buton Metni
              </label>
              <input
                type="text"
                value={section?.buttonText || ""}
                onChange={(e) => setSection((s) => s ? { ...s, buttonText: e.target.value } : s)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buton Linki
              </label>
              <input
                type="text"
                value={section?.buttonLink || ""}
                onChange={(e) => setSection((s) => s ? { ...s, buttonLink: e.target.value } : s)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#D4A853] text-white rounded-lg hover:bg-[#c49843] disabled:opacity-50 transition-colors"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>

      {/* Blog Posts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Blog Yazıları / Tarifler</h2>
          <button
            onClick={openNewPostModal}
            className="px-4 py-2 bg-[#1a2332] text-white rounded-lg hover:bg-[#2a3342] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Yazı Ekle
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#D4A853] transition-colors"
            >
              {/* Image */}
              <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getValidImageSrc(post.image, "/images/blog-1.svg")}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800 truncate">{post.title}</h3>
                  {post.featured && (
                    <span className="px-2 py-0.5 bg-[#D4A853] text-white text-xs rounded">
                      Öne Çıkan
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {post.author} • {new Date(post.date).toLocaleDateString("tr-TR")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(post)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.featured
                      ? "bg-[#D4A853] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#D4A853] hover:text-white"
                  }`}
                  title={post.featured ? "Öne çıkandan kaldır" : "Öne çıkar"}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => openEditPostModal(post)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#1a2332] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Henüz yazı eklenmemiş.
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingPost ? "Yazı Düzenle" : "Yeni Yazı Ekle"}
            </h3>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kapak Görseli
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {postForm.image && getValidImageSrc(postForm.image, '') ? (
                    <div className="relative aspect-video max-w-sm">
                      <Image
                        src={getValidImageSrc(postForm.image, '/images/placeholder.jpg')}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setPostForm((p) => ({ ...p, image: "" }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block text-center py-8">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500">Görsel yüklemek için tıklayın</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => {
                    setPostForm((p) => ({ 
                      ...p, 
                      title: e.target.value,
                      slug: editingPost ? p.slug : generateSlug(e.target.value)
                    }));
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={postForm.slug}
                  onChange={(e) => setPostForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Özet
                </label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm((p) => ({ ...p, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İçerik
                </label>
                <RichTextEditor
                  content={postForm.content}
                  onChange={(html) => setPostForm((p) => ({ ...p, content: html }))}
                  placeholder="Blog içeriğini yazın..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yazar
                  </label>
                  <input
                    type="text"
                    value={postForm.author}
                    onChange={(e) => setPostForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postForm.featured}
                      onChange={(e) => setPostForm((p) => ({ ...p, featured: e.target.checked }))}
                      className="w-5 h-5 text-[#D4A853] rounded focus:ring-[#D4A853]"
                    />
                    <span className="text-sm font-medium text-gray-700">Öne Çıkan Yazı</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || !postForm.title || !postForm.slug}
                  className="flex-1 px-4 py-2 bg-[#D4A853] text-white rounded-lg hover:bg-[#c49843] disabled:opacity-50 transition-colors"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
