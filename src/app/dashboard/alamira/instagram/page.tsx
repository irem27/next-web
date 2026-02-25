"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface InstagramPost {
  id: string;
  image: string;
  alt: string | null;
  link: string | null;
  order: number;
  isActive: boolean;
}

interface SectionSettings {
  id: string;
  badgeText: string;
  title: string;
  description: string | null;
}

export default function InstagramPage() {
  const [section, setSection] = useState<SectionSettings | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Edit post modal
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    image: "",
    alt: "",
    link: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/instagram");
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
      const res = await fetch("/api/admin/instagram", {
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

  const handleImageUpload = async (file: File, forPost = false) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (forPost) {
          setPostForm((prev) => ({ ...prev, image: data.url }));
        }
        return data.url;
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return null;
  };

  const openNewPostModal = () => {
    setEditingPost(null);
    setPostForm({ image: "", alt: "", link: "https://instagram.com/alamira.rice" });
    setShowPostModal(true);
  };

  const openEditPostModal = (post: InstagramPost) => {
    setEditingPost(post);
    setPostForm({
      image: post.image,
      alt: post.alt || "",
      link: post.link || "",
    });
    setShowPostModal(true);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPost) {
        // Update
        const res = await fetch("/api/admin/instagram/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPost.id, ...postForm }),
        });

        if (res.ok) {
          setMessage("Post güncellendi!");
          fetchData();
        }
      } else {
        // Create
        const res = await fetch("/api/admin/instagram/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postForm),
        });

        if (res.ok) {
          setMessage("Yeni post eklendi!");
          fetchData();
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
    if (!confirm("Bu postu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/instagram/posts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("Post silindi!");
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Delete error:", error);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Instagram Bölümü</h1>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Section Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Section Ayarları</h2>
        
        <form onSubmit={handleSectionSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={section?.description || ""}
              onChange={(e) => setSection((s) => s ? { ...s, description: e.target.value } : s)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
            />
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

      {/* Instagram Posts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Instagram Postları</h2>
          <button
            onClick={openNewPostModal}
            className="px-4 py-2 bg-[#1a2332] text-white rounded-lg hover:bg-[#2a3342] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Post Ekle
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="relative aspect-square">
                <Image
                  src={getValidImageSrc(post.image, '/images/instagram-placeholder.jpg')}
                  alt={post.alt || "Instagram post"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEditPostModal(post)}
                  className="p-2 bg-white rounded-full text-gray-800 hover:bg-[#D4A853] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Order badge */}
              <div className="absolute top-2 left-2 bg-[#1a2332] text-white text-xs px-2 py-1 rounded">
                #{post.order + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingPost ? "Post Düzenle" : "Yeni Post Ekle"}
            </h3>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {postForm.image && getValidImageSrc(postForm.image, '') ? (
                    <div className="relative aspect-video">
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
                          if (file) handleImageUpload(file, true);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={postForm.alt}
                  onChange={(e) => setPostForm((p) => ({ ...p, alt: e.target.value }))}
                  placeholder="Görsel açıklaması"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={postForm.link}
                  onChange={(e) => setPostForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                />
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
                  disabled={saving || !postForm.image}
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
