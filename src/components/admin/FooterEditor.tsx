"use client";

import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LinkItem {
  label: string;
  href: string;
}

interface WorkingHour {
  day: string;
  hours: string;
}

interface FooterData {
  id: string;
  siteKey: string;
  newsletterTitle: string;
  brandName: string;
  brandDescription: string | null;
  accentColor: string;
  copyrightText: string | null;
  topLinks: string;
  serviceLinks: string;
  workingHours: string;
}

interface FooterEditorProps {
  siteKey: string;
  accentColor?: string;
  pageTitle?: string;
  pageDescription?: string;
}

function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export default function FooterEditor({
  siteKey,
  accentColor = "#D4A853",
  pageTitle = "Footer Düzenle",
  pageDescription = "Footer içeriğini buradan yönetin.",
}: FooterEditorProps) {
  const [data, setData] = useState<FooterData | null>(null);
  const [topLinks, setTopLinks] = useState<LinkItem[]>([]);
  const [serviceLinks, setServiceLinks] = useState<LinkItem[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/footer?siteKey=${siteKey}`);
      if (!res.ok) throw new Error();
      const d: FooterData = await res.json();
      setData(d);
      setTopLinks(parseJSON<LinkItem[]>(d.topLinks, []));
      setServiceLinks(parseJSON<LinkItem[]>(d.serviceLinks, []));
      setWorkingHours(parseJSON<WorkingHour[]>(d.workingHours, []));
    } catch {
      toast.error("Veriler alınamadı!");
    } finally {
      setLoading(false);
    }
  }, [siteKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || saving) return;
    setSaving(true);
    try {
      const payload = {
        ...data,
        topLinks: JSON.stringify(topLinks),
        serviceLinks: JSON.stringify(serviceLinks),
        workingHours: JSON.stringify(workingHours),
      };
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("Kaydedildi!");
    } catch {
      toast.error("Kayıt başarısız!");
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (list: LinkItem[], setList: (v: LinkItem[]) => void, idx: number, field: keyof LinkItem, value: string) => {
    const next = [...list];
    next[idx] = { ...next[idx], [field]: value };
    setList(next);
  };

  const addLink = (list: LinkItem[], setList: (v: LinkItem[]) => void) => {
    setList([...list, { label: "", href: "" }]);
  };

  const removeLink = (list: LinkItem[], setList: (v: LinkItem[]) => void, idx: number) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const updateHour = (idx: number, field: keyof WorkingHour, value: string) => {
    const next = [...workingHours];
    next[idx] = { ...next[idx], [field]: value };
    setWorkingHours(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor }} />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6"><div className="bg-red-50 text-red-600 p-4 rounded-lg">Veri yüklenemedi.</div></div>;
  }

  const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:border-transparent outline-none text-slate-900";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        <p className="text-slate-500 text-sm mt-1">{pageDescription}</p>
      </div>

      <form onSubmit={save} className="space-y-8">
        {/* Brand Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Marka Bilgileri</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Marka Adı</label>
              <input
                className={inputClass}
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                value={data.brandName}
                onChange={(e) => setData({ ...data, brandName: e.target.value })}
                placeholder="ALAMIRA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Accent Renk</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                />
                <input
                  className={inputClass}
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  value={data.accentColor}
                  onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                  placeholder="#D4A853"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Marka Açıklaması</label>
              <textarea
                className={`${inputClass} resize-none`}
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                rows={3}
                value={data.brandDescription || ""}
                onChange={(e) => setData({ ...data, brandDescription: e.target.value })}
                placeholder="Footer'da görünecek marka açıklaması..."
              />
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Newsletter Bölümü</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Newsletter Başlığı</label>
            <textarea
              className={`${inputClass} resize-none`}
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              rows={2}
              value={data.newsletterTitle}
              onChange={(e) => setData({ ...data, newsletterTitle: e.target.value })}
              placeholder="Her satır ayrı bir satır olarak görünecek..."
            />
            <p className="text-xs text-slate-400 mt-1">Her satır ayrı bir satır olarak gösterilir.</p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Çalışma Saatleri</h2>
            <button
              type="button"
              onClick={() => setWorkingHours([...workingHours, { day: "", hours: "" }])}
              className="text-sm font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              + Ekle
            </button>
          </div>
          <div className="space-y-3">
            {workingHours.map((wh, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  className={`${inputClass} flex-1`}
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  value={wh.day}
                  onChange={(e) => updateHour(i, "day", e.target.value)}
                  placeholder="Mon-Fri"
                />
                <input
                  className={`${inputClass} flex-1`}
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  value={wh.hours}
                  onChange={(e) => updateHour(i, "hours", e.target.value)}
                  placeholder="8:00 AM - 7:00 PM"
                />
                <button type="button" onClick={() => setWorkingHours(workingHours.filter((_, j) => j !== i))} className="text-red-500 hover:bg-red-50 rounded p-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {workingHours.length === 0 && <p className="text-slate-400 text-sm">Henüz çalışma saati eklenmemiş.</p>}
          </div>
        </div>

        {/* Top Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Üst Linkler (Top Links)</h2>
            <button type="button" onClick={() => addLink(topLinks, setTopLinks)} className="text-sm font-medium px-3 py-1.5 rounded-lg text-white transition-colors" style={{ backgroundColor: accentColor }}>
              + Ekle
            </button>
          </div>
          <div className="space-y-3">
            {topLinks.map((link, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input className={`${inputClass} flex-1`} style={{ "--tw-ring-color": accentColor } as React.CSSProperties} value={link.label} onChange={(e) => updateLink(topLinks, setTopLinks, i, "label", e.target.value)} placeholder="Link adı" />
                <input className={`${inputClass} flex-1`} style={{ "--tw-ring-color": accentColor } as React.CSSProperties} value={link.href} onChange={(e) => updateLink(topLinks, setTopLinks, i, "href", e.target.value)} placeholder="/about" />
                <button type="button" onClick={() => removeLink(topLinks, setTopLinks, i)} className="text-red-500 hover:bg-red-50 rounded p-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {topLinks.length === 0 && <p className="text-slate-400 text-sm">Henüz link eklenmemiş.</p>}
          </div>
        </div>

        {/* Service Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Hizmet Linkleri (Our Services)</h2>
            <button type="button" onClick={() => addLink(serviceLinks, setServiceLinks)} className="text-sm font-medium px-3 py-1.5 rounded-lg text-white transition-colors" style={{ backgroundColor: accentColor }}>
              + Ekle
            </button>
          </div>
          <div className="space-y-3">
            {serviceLinks.map((link, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input className={`${inputClass} flex-1`} style={{ "--tw-ring-color": accentColor } as React.CSSProperties} value={link.label} onChange={(e) => updateLink(serviceLinks, setServiceLinks, i, "label", e.target.value)} placeholder="Link adı" />
                <input className={`${inputClass} flex-1`} style={{ "--tw-ring-color": accentColor } as React.CSSProperties} value={link.href} onChange={(e) => updateLink(serviceLinks, setServiceLinks, i, "href", e.target.value)} placeholder="/products" />
                <button type="button" onClick={() => removeLink(serviceLinks, setServiceLinks, i)} className="text-red-500 hover:bg-red-50 rounded p-2 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {serviceLinks.length === 0 && <p className="text-slate-400 text-sm">Henüz link eklenmemiş.</p>}
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Alt Bilgi</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Copyright Metni</label>
            <input
              className={inputClass}
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
              value={data.copyrightText || ""}
              onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
              placeholder="© 2026 Brand. All Rights Reserved."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={fetchData} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
