"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === "") return fallback;
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) return src;
  return fallback;
}

interface AboutData {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  happyUsersCount: string;
  happyUsersText: string;
  image1: string | null;
  image1Alt: string | null;
  image2: string | null;
  image2Alt: string | null;
  infoCardTitle: string | null;
  infoCardText: string | null;
  badgePercent: string;
  badgeSubtext: string;
  isActive: boolean;
}

interface AboutEditorProps {
  siteKey: string;
  accentColor?: string;
  pageTitle?: string;
  pageDescription?: string;
}

type AboutValuesSection = {
  id: string;
  siteKey: string;
  badgeText: string;
  title: string;
  isActive: boolean;
};

type AboutValueItem = {
  id?: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  order?: number | null;
  isActive?: boolean | null;
};

type AboutCtaSection = {
  id?: string;
  siteKey?: string;
  title: string;
  description: string | null;
  primaryButtonText: string | null;
  primaryButtonLink: string | null;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
  isActive: boolean;
};

export default function AboutEditor({
  siteKey,
  accentColor = "#D4A853",
  pageTitle = "About Section Düzenle",
  pageDescription = "Hakkımızda bölümü içeriğini düzenleyin.",
}: AboutEditorProps) {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  const [valuesSection, setValuesSection] = useState<AboutValuesSection | null>(null);
  const [valuesItems, setValuesItems] = useState<AboutValueItem[]>([]);
  const [valuesLoading, setValuesLoading] = useState(false);
  const [valuesSaving, setValuesSaving] = useState(false);
  const [ctaSection, setCtaSection] = useState<AboutCtaSection | null>(null);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [ctaSaving, setCtaSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
    if (siteKey === "about") fetchValuesData();
    if (siteKey === "about") fetchCtaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/about?siteKey=${siteKey}`);
      if (res.ok) {
        setAboutData(await res.json());
      } else {
        setMessage({ type: "error", text: "Veri yüklenirken hata oluştu" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setLoading(false);
    }
  };

  const fetchValuesData = async () => {
    setValuesLoading(true);
    try {
      const res = await fetch(`/api/admin/about-values?siteKey=${siteKey}`);
      if (res.ok) {
        const data = await res.json();
        setValuesSection(data.section || null);
        setValuesItems(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      // ignore; keep empty state
    } finally {
      setValuesLoading(false);
    }
  };

  const saveValues = async () => {
    if (valuesSaving) return;
    setValuesSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/about-values", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteKey,
          section: valuesSection,
          items: valuesItems,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setValuesSection(data.section || null);
        setValuesItems(Array.isArray(data.items) ? data.items : []);
        setMessage({ type: "success", text: "Değerler bölümü kaydedildi!" });
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: err.error || "Değerler kaydedilemedi" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setValuesSaving(false);
    }
  };

  const fetchCtaData = async () => {
    setCtaLoading(true);
    try {
      const res = await fetch(`/api/admin/about-cta?siteKey=${siteKey}`);
      if (res.ok) setCtaSection(await res.json());
    } catch {
      // ignore
    } finally {
      setCtaLoading(false);
    }
  };

  const saveCta = async () => {
    if (!ctaSection || ctaSaving) return;
    setCtaSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/about-cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ctaSection, siteKey }),
      });
      if (res.ok) {
        setCtaSection(await res.json());
        setMessage({ type: "success", text: "CTA bölümü kaydedildi!" });
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: err.error || "CTA kaydedilemedi" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setCtaSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image1" | "image2") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setUploading = field === "image1" ? setUploadingImage1 : setUploadingImage2;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setAboutData((prev) => (prev ? { ...prev, [field]: data.url } : null));
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: accentColor }} />
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Veri yüklenemedi. Lütfen sayfayı yenileyin.</div>
      </div>
    );
  }

  const ringClass = `focus:ring-2 focus:border-transparent outline-none`;
  const ringStyle = { "--tw-ring-color": accentColor } as React.CSSProperties;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{pageTitle}</h1>
        <p className="text-slate-600 mt-1">{pageDescription}</p>
      </div>

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
        {/* Header Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Başlık Alanı</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Badge Metni</label>
              <input
                type="text"
                value={aboutData.badgeText}
                onChange={(e) => setAboutData({ ...aboutData, badgeText: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="About Us..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ana Başlık</label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="Başlık..."
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
              <textarea
                value={aboutData.description || ""}
                onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg resize-none ${ringClass}`}
                style={ringStyle}
                placeholder="Açıklama metni..."
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">İstatistikler</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mutlu Kullanıcı Sayısı</label>
              <input
                type="text"
                value={aboutData.happyUsersCount}
                onChange={(e) => setAboutData({ ...aboutData, happyUsersCount: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="2000+..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mutlu Kullanıcı Metni</label>
              <input
                type="text"
                value={aboutData.happyUsersText}
                onChange={(e) => setAboutData({ ...aboutData, happyUsersText: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="Happy Users Rating..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Badge Yüzdesi</label>
              <input
                type="text"
                value={aboutData.badgePercent}
                onChange={(e) => setAboutData({ ...aboutData, badgePercent: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="100%..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Badge Alt Metni</label>
              <input
                type="text"
                value={aboutData.badgeSubtext}
                onChange={(e) => setAboutData({ ...aboutData, badgeSubtext: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="Pure Rice, Pure Life..."
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Bilgi Kartı</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kart Başlığı</label>
              <input
                type="text"
                value={aboutData.infoCardTitle || ""}
                onChange={(e) => setAboutData({ ...aboutData, infoCardTitle: e.target.value })}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                style={ringStyle}
                placeholder="Kart başlığı..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kart İçeriği</label>
              <textarea
                value={aboutData.infoCardText || ""}
                onChange={(e) => setAboutData({ ...aboutData, infoCardText: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border border-slate-300 rounded-lg resize-none ${ringClass}`}
                style={ringStyle}
                placeholder="Kart açıklama metni..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Görseller</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(["image1", "image2"] as const).map((field, idx) => {
              const img = aboutData[field];
              const alt = aboutData[`${field}Alt` as keyof AboutData] as string | null;
              const uploading = field === "image1" ? uploadingImage1 : uploadingImage2;
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {idx === 0 ? "Sol Görsel" : "Sağ Görsel"}
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-opacity-80 transition-colors" style={{ borderColor: img ? accentColor : undefined }}>
                    {img && getValidImageSrc(img, "") ? (
                      <div className="relative aspect-video mb-4">
                        <Image src={getValidImageSrc(img, "/images/placeholder.jpg")} alt={`Image ${idx + 1}`} fill className="object-cover rounded-lg" />
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
                        {uploading ? "Yükleniyor..." : "Resim Yükle"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field)} disabled={uploading} />
                    </label>
                    <input
                      type="text"
                      value={alt || ""}
                      onChange={(e) => setAboutData({ ...aboutData, [`${field}Alt`]: e.target.value })}
                      placeholder="Alt metin..."
                      className={`w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg text-sm ${ringClass}`}
                      style={ringStyle}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Ayarlar</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aboutData.isActive}
              onChange={(e) => setAboutData({ ...aboutData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
              style={{ accentColor }}
            />
            <span className="text-slate-700">About Section Aktif</span>
          </label>
        </div>

        {/* Values Section (About page only) */}
        {siteKey === "about" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">What Makes Us Different</h2>
                <p className="text-slate-500 text-sm mt-1">/about sayfasındaki değerler bölümünü düzenleyin.</p>
              </div>
              <button
                type="button"
                onClick={saveValues}
                disabled={valuesSaving || valuesLoading}
                className="px-5 py-2.5 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
              >
                {valuesSaving ? "Kaydediliyor..." : "Değerleri Kaydet"}
              </button>
            </div>

            {valuesLoading ? (
              <div className="text-slate-500">Yükleniyor...</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Badge Metni</label>
                    <input
                      type="text"
                      value={valuesSection?.badgeText || ""}
                      onChange={(e) =>
                        setValuesSection((prev) =>
                          prev
                            ? { ...prev, badgeText: e.target.value }
                            : ({ id: "", siteKey, badgeText: e.target.value, title: "", isActive: true } as AboutValuesSection)
                        )
                      }
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="Unsere Werte"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                    <input
                      type="text"
                      value={valuesSection?.title || ""}
                      onChange={(e) =>
                        setValuesSection((prev) =>
                          prev
                            ? { ...prev, title: e.target.value }
                            : ({ id: "", siteKey, badgeText: "", title: e.target.value, isActive: true } as AboutValuesSection)
                        )
                      }
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="Was uns besonders macht"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={valuesSection?.isActive ?? true}
                        onChange={(e) =>
                          setValuesSection((prev) =>
                            prev
                              ? { ...prev, isActive: e.target.checked }
                              : ({ id: "", siteKey, badgeText: "", title: "", isActive: e.target.checked } as AboutValuesSection)
                          )
                        }
                        className="w-5 h-5 rounded border-slate-300"
                        style={{ accentColor }}
                      />
                      <span className="text-slate-700">Değerler Bölümü Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Kartlar</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setValuesItems((prev) => [
                        ...prev,
                        { title: "", description: "", icon: "heart", order: prev.length, isActive: true },
                      ])
                    }
                    className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    + Kart Ekle
                  </button>
                </div>

                <div className="space-y-3">
                  {valuesItems.map((it, idx) => (
                    <div key={it.id || idx} className="border border-slate-200 rounded-xl p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <div className="lg:col-span-3">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Başlık</label>
                          <input
                            value={it.title}
                            onChange={(e) =>
                              setValuesItems((prev) => prev.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p)))
                            }
                            className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm ${ringClass}`}
                            style={ringStyle}
                            placeholder="Leidenschaft"
                          />
                        </div>

                        <div className="lg:col-span-5">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Açıklama</label>
                          <input
                            value={it.description || ""}
                            onChange={(e) =>
                              setValuesItems((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p))
                              )
                            }
                            className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm ${ringClass}`}
                            style={ringStyle}
                            placeholder="Kısa açıklama..."
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">İkon</label>
                          <select
                            value={it.icon || "heart"}
                            onChange={(e) =>
                              setValuesItems((prev) => prev.map((p, i) => (i === idx ? { ...p, icon: e.target.value } : p)))
                            }
                            className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm ${ringClass}`}
                            style={ringStyle}
                          >
                            <option value="heart">Heart</option>
                            <option value="shield">Shield</option>
                            <option value="globe">Globe</option>
                            <option value="users">Users</option>
                          </select>
                        </div>

                        <div className="lg:col-span-1">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Sıra</label>
                          <input
                            type="number"
                            value={typeof it.order === "number" ? it.order : idx}
                            onChange={(e) =>
                              setValuesItems((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, order: Number(e.target.value) } : p))
                              )
                            }
                            className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm ${ringClass}`}
                            style={ringStyle}
                          />
                        </div>

                        <div className="lg:col-span-1 flex items-center justify-between lg:justify-end gap-3">
                          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={it.isActive ?? true}
                              onChange={(e) =>
                                setValuesItems((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, isActive: e.target.checked } : p))
                                )
                              }
                              className="w-4 h-4 rounded border-slate-300"
                              style={{ accentColor }}
                            />
                            Aktif
                          </label>
                          <button
                            type="button"
                            onClick={() => setValuesItems((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {valuesItems.length === 0 && (
                    <div className="text-sm text-slate-500">Henüz kart eklenmemiş.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* About CTA Section (About page only) */}
        {siteKey === "about" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">CTA (Ready to Experience...)</h2>
                <p className="text-slate-500 text-sm mt-1">/about sayfasının en altındaki çağrı alanı.</p>
              </div>
              <button
                type="button"
                onClick={saveCta}
                disabled={ctaSaving || ctaLoading || !ctaSection}
                className="px-5 py-2.5 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                style={{ backgroundColor: accentColor }}
              >
                {ctaSaving ? "Kaydediliyor..." : "CTA Kaydet"}
              </button>
            </div>

            {ctaLoading ? (
              <div className="text-slate-500">Yükleniyor...</div>
            ) : !ctaSection ? (
              <div className="text-slate-500">CTA verisi yüklenemedi.</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                    <input
                      value={ctaSection.title}
                      onChange={(e) => setCtaSection({ ...ctaSection, title: e.target.value })}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="Ready to Experience Pure Rice?"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                    <textarea
                      value={ctaSection.description || ""}
                      onChange={(e) => setCtaSection({ ...ctaSection, description: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg resize-none ${ringClass}`}
                      style={ringStyle}
                      placeholder="CTA açıklaması..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Birincil Buton Metni</label>
                    <input
                      value={ctaSection.primaryButtonText || ""}
                      onChange={(e) => setCtaSection({ ...ctaSection, primaryButtonText: e.target.value })}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="View Our Products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Birincil Buton Linki</label>
                    <input
                      value={ctaSection.primaryButtonLink || ""}
                      onChange={(e) => setCtaSection({ ...ctaSection, primaryButtonLink: e.target.value })}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="/products"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">İkincil Buton Metni</label>
                    <input
                      value={ctaSection.secondaryButtonText || ""}
                      onChange={(e) => setCtaSection({ ...ctaSection, secondaryButtonText: e.target.value })}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">İkincil Buton Linki</label>
                    <input
                      value={ctaSection.secondaryButtonLink || ""}
                      onChange={(e) => setCtaSection({ ...ctaSection, secondaryButtonLink: e.target.value })}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-lg ${ringClass}`}
                      style={ringStyle}
                      placeholder="/contact"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctaSection.isActive}
                        onChange={(e) => setCtaSection({ ...ctaSection, isActive: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300"
                        style={{ accentColor }}
                      />
                      <span className="text-slate-700">CTA Bölümü Aktif</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={fetchAboutData} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
            Değişiklikleri İptal Et
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: accentColor }}
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
