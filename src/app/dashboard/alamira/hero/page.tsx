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

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  heroImage: string;
  isActive: boolean;
}

export default function HeroEditPage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      if (res.ok) {
        const data = await res.json();
        setHeroData(data);
      } else {
        setMessage({ type: "error", text: "Veri yüklenirken hata oluştu" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroData) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Değişiklikler başarıyla kaydedildi!" });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Kaydetme hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "backgroundImage" | "heroImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = field === "backgroundImage" ? setUploadingBg : setUploadingHero;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setHeroData((prev) => prev ? { ...prev, [field]: data.url } : null);
      } else {
        setMessage({ type: "error", text: "Resim yüklenirken hata oluştu" });
      }
    } catch {
      setMessage({ type: "error", text: "Resim yükleme hatası" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A853]" />
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Veri yüklenemedi. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Hero Section Düzenle</h1>
        <p className="text-slate-600 mt-1">Ana sayfa banner içeriğini düzenleyin.</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Text Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Metin İçerikleri</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                placeholder="Ana başlık..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alt Başlık
              </label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                placeholder="Alt başlık..."
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent resize-none"
                placeholder="Açıklama metni..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buton Metni
              </label>
              <input
                type="text"
                value={heroData.buttonText}
                onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                placeholder="Keşfet..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buton Linki
              </label>
              <input
                type="text"
                value={heroData.buttonLink}
                onChange={(e) => setHeroData({ ...heroData, buttonLink: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                placeholder="/urunler..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Görseller</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Arka Plan Görseli
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-[#D4A853] transition-colors">
                {heroData.backgroundImage && getValidImageSrc(heroData.backgroundImage, '') ? (
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={getValidImageSrc(heroData.backgroundImage, '/images/placeholder.jpg')}
                      alt="Background"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                    {uploadingBg ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Resim Yükle
                      </>
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "backgroundImage")}
                    disabled={uploadingBg}
                  />
                </label>
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ürün Görseli (Bal Kavanoz)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-[#D4A853] transition-colors">
                {heroData.heroImage && getValidImageSrc(heroData.heroImage, '') ? (
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={getValidImageSrc(heroData.heroImage, '/images/placeholder.jpg')}
                      alt="Hero"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                    {uploadingHero ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Resim Yükle
                      </>
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "heroImage")}
                    disabled={uploadingHero}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Ayarlar</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={heroData.isActive}
              onChange={(e) => setHeroData({ ...heroData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-[#D4A853] focus:ring-[#D4A853]"
            />
            <span className="text-slate-700">Hero Section Aktif</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => fetchHeroData()}
            className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Değişiklikleri İptal Et
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
