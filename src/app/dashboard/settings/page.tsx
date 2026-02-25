"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GeneralSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  siteDescription: string | null;
  logo: string | null;
  logoAlamira: string | null;
  logoLogistics: string | null;
  favicon: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  linkedin: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  footerText: string | null;
  copyrightText: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "logos" | "contact" | "social" | "seo" | "footer">("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Ayarlar kaydedildi!");
      } else {
        alert("Bir hata oluştu!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof GeneralSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "logoAlamira" | "logoLogistics" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploadingLogo(field);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, [field]: data.url });
      } else {
        alert("Yükleme başarısız!");
      }
    } catch {
      alert("Yükleme hatası!");
    } finally {
      setUploadingLogo(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Ayarlar yüklenemedi</p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Genel", icon: "⚙️" },
    { id: "logos", label: "Logolar", icon: "🖼️" },
    { id: "contact", label: "İletişim", icon: "📞" },
    { id: "social", label: "Sosyal Medya", icon: "🔗" },
    { id: "seo", label: "SEO", icon: "🔍" },
    { id: "footer", label: "Footer", icon: "📄" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
          <p className="text-gray-500 mt-1">
            Genel site ayarlarını buradan yönetin
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Kaydediliyor...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Kaydet
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave}>
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">
              Genel Bilgiler
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateField("siteName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Alamira Rice"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={settings.siteTagline}
                  onChange={(e) => updateField("siteTagline", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pure Rice, Pure Life"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Açıklaması
              </label>
              <textarea
                value={settings.siteDescription || ""}
                onChange={(e) => updateField("siteDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Site hakkında kısa bir açıklama..."
              />
            </div>

          </div>
        )}

        {/* Logos Tab */}
        {activeTab === "logos" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">Logo Yönetimi</h2>

            {/* Alamira Logo */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Alamira Rice Logo</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-40 h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {settings.logoAlamira ? (
                    <Image src={settings.logoAlamira} alt="Alamira Logo" width={160} height={112} className="object-contain w-full h-full p-2" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors">
                    {uploadingLogo === "logoAlamira" ? "Yükleniyor..." : "Logo Yükle"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "logoAlamira")} disabled={uploadingLogo === "logoAlamira"} />
                  </label>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">veya URL girin</label>
                    <input type="text" value={settings.logoAlamira || ""} onChange={(e) => updateField("logoAlamira", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="/images/alamira-logo.png" />
                  </div>
                  {settings.logoAlamira && (
                    <button type="button" onClick={() => updateField("logoAlamira", "")} className="text-red-500 hover:text-red-700 text-xs font-medium">Logoyu Kaldır</button>
                  )}
                </div>
              </div>
            </div>

            {/* Logistics Logo */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Logistics Logo</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-40 h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {settings.logoLogistics ? (
                    <Image src={settings.logoLogistics} alt="Logistics Logo" width={160} height={112} className="object-contain w-full h-full p-2" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                    {uploadingLogo === "logoLogistics" ? "Yükleniyor..." : "Logo Yükle"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "logoLogistics")} disabled={uploadingLogo === "logoLogistics"} />
                  </label>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">veya URL girin</label>
                    <input type="text" value={settings.logoLogistics || ""} onChange={(e) => updateField("logoLogistics", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="/images/logistics-logo.png" />
                  </div>
                  {settings.logoLogistics && (
                    <button type="button" onClick={() => updateField("logoLogistics", "")} className="text-red-500 hover:text-red-700 text-xs font-medium">Logoyu Kaldır</button>
                  )}
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Favicon</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {settings.favicon ? (
                    <Image src={settings.favicon} alt="Favicon" width={64} height={64} className="object-contain w-full h-full p-1" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    {uploadingLogo === "favicon" ? "Yükleniyor..." : "Favicon Yükle"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, "favicon")} disabled={uploadingLogo === "favicon"} />
                  </label>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">veya URL girin</label>
                    <input type="text" value={settings.favicon || ""} onChange={(e) => updateField("favicon", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="/favicon.ico" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">
              İletişim Bilgileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@alamira.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={settings.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(000) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                value={settings.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tam adres bilgisi..."
              />
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">
              Sosyal Medya Linkleri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                    Facebook
                  </span>
                </label>
                <input
                  type="url"
                  value={settings.facebook || ""}
                  onChange={(e) => updateField("facebook", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </span>
                </label>
                <input
                  type="url"
                  value={settings.instagram || ""}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    Twitter / X
                  </span>
                </label>
                <input
                  type="url"
                  value={settings.twitter || ""}
                  onChange={(e) => updateField("twitter", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                    YouTube
                  </span>
                </label>
                <input
                  type="url"
                  value={settings.youtube || ""}
                  onChange={(e) => updateField("youtube", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </span>
                </label>
                <input
                  type="url"
                  value={settings.linkedin || ""}
                  onChange={(e) => updateField("linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">
              SEO Ayarları
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Başlık
              </label>
              <input
                type="text"
                value={settings.metaTitle || ""}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alamira Rice | Premium Basmati & Sella Rice"
              />
              <p className="mt-1 text-sm text-gray-500">
                Tarayıcı sekmesinde ve arama sonuçlarında görünür (50-60 karakter önerilir)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Açıklama
              </label>
              <textarea
                value={settings.metaDescription || ""}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Site hakkında kısa açıklama..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Arama sonuçlarında gösterilir (150-160 karakter önerilir)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anahtar Kelimeler
              </label>
              <input
                type="text"
                value={settings.metaKeywords || ""}
                onChange={(e) => updateField("metaKeywords", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="rice, basmati, sella, organic, premium"
              />
              <p className="mt-1 text-sm text-gray-500">
                Virgülle ayırarak yazın
              </p>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-4">
              Footer Ayarları
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Açıklama Metni
              </label>
              <textarea
                value={settings.footerText || ""}
                onChange={(e) => updateField("footerText", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Footer'da görünecek açıklama metni..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Metni
              </label>
              <input
                type="text"
                value={settings.copyrightText || ""}
                onChange={(e) => updateField("copyrightText", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="© 2026 Alamira Rice. All rights reserved."
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
