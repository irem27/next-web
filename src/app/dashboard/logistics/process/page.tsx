"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SectionData = { id: string; title: string; description: string };

type StepItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: string;
  badgeText: string;
  colorTheme: string;
  isDark: boolean;
  hasImage: boolean;
  order: number;
};

const EMPTY_STEP: StepItem = {
  id: "",
  number: "",
  title: "",
  description: "",
  image: "",
  imageAlt: "",
  icon: "",
  badgeText: "",
  colorTheme: "blue",
  isDark: false,
  hasImage: false,
  order: 0,
};

const COLOR_OPTIONS = ["blue", "green", "orange", "purple"];
const ICON_OPTIONS = ["order", "route", "package", "tracking", "delivery"];

export default function LogisticsProcessAdmin() {
  const [section, setSection] = useState<SectionData | null>(null);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [editing, setEditing] = useState<StepItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logistics/process");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSection({
        id: data.section.id,
        title: data.section.title ?? "",
        description: data.section.description ?? "",
      });
      setSteps(
        (data.steps ?? []).map((s: StepItem) => ({
          ...s,
          image: s.image ?? "",
          imageAlt: s.imageAlt ?? "",
          icon: s.icon ?? "",
          badgeText: s.badgeText ?? "",
          description: s.description ?? "",
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
      const res = await fetch("/api/admin/logistics/process", {
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

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editing) return;
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditing({ ...editing, [name]: checked });
    } else {
      setEditing({ ...editing, [name]: name === "order" ? parseInt(value) || 0 : value });
    }
  };

  const saveStep = async (e: React.FormEvent) => {
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

      const res = await fetch("/api/admin/logistics/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "step", ...editing, image: imageUrl }),
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

  const deleteStep = async (id: string) => {
    if (!confirm("Bu adımı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/logistics/process?id=${id}`, { method: "DELETE" });
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">How We Work Yönetimi</h2>
        <p className="text-slate-500 text-sm mt-1">
          Süreç adımlarının başlıklarını, açıklamalarını ve görsel ayarlarını buradan yönetin.
        </p>
      </div>

      {/* Section Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Bölüm Başlığı</h3>
        <form onSubmit={saveSection} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="sec-title">Başlık</label>
            <input
              id="sec-title"
              name="title"
              value={section?.title ?? ""}
              onChange={handleSectionChange}
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="sec-desc">Açıklama</label>
            <textarea
              id="sec-desc"
              name="description"
              value={section?.description ?? ""}
              onChange={handleSectionChange}
              rows={2}
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors w-fit"
          >
            {loading ? "Kaydediliyor..." : "Başlığı Kaydet"}
          </button>
        </form>
      </div>

      {/* Steps List */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Süreç Adımları</h3>
        <button
          type="button"
          onClick={() =>
            setEditing({
              ...EMPTY_STEP,
              number: String(steps.length + 1).padStart(2, "0"),
              order: steps.length,
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          + Yeni Adım
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                  step.isDark
                    ? "bg-slate-900 text-white"
                    : step.colorTheme === "green"
                      ? "bg-green-50 text-green-600"
                      : step.colorTheme === "orange"
                        ? "bg-orange-50 text-orange-600"
                        : step.colorTheme === "purple"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                }`}
              >
                {step.number}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{step.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">
                    {step.isDark ? "Koyu" : step.colorTheme} tema
                  </span>
                  {step.hasImage && <span className="text-xs text-blue-500">• Görselli</span>}
                  {step.badgeText && <span className="text-xs text-green-500">• {step.badgeText}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing({ ...step })}
                className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => deleteStep(step.id)}
                className="text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Step Form */}
      {editing && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            {editing.id ? "Adımı Düzenle" : "Yeni Adım Ekle"}
          </h3>
          <form onSubmit={saveStep} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="step-number">Numara</label>
                <input id="step-number" name="number" value={editing.number} onChange={handleStepChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="step-color">Renk Teması</label>
                <select id="step-color" name="colorTheme" value={editing.colorTheme} onChange={handleStepChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="step-icon">İkon</label>
                <select id="step-icon" name="icon" value={editing.icon} onChange={handleStepChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Yok</option>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="step-order">Sıra</label>
                <input id="step-order" name="order" type="number" value={editing.order} onChange={handleStepChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="step-title">Başlık</label>
              <input id="step-title" name="title" value={editing.title} onChange={handleStepChange}
                placeholder="Ör: Order Placement"
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="step-desc">Açıklama</label>
              <textarea id="step-desc" name="description" value={editing.description} onChange={handleStepChange}
                rows={3}
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="step-badge">Rozet Metni (ikonlu kart altı)</label>
              <input id="step-badge" name="badgeText" value={editing.badgeText} onChange={handleStepChange}
                placeholder="Ör: Optimized Routes"
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isDark" checked={editing.isDark} onChange={handleStepChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-900 font-medium">Koyu Tema</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="hasImage" checked={editing.hasImage} onChange={handleStepChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-900 font-medium">Görsel Var</span>
              </label>
            </div>

            {/* Image fields - shown when hasImage is true */}
            {editing.hasImage && (
              <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-medium text-sm" htmlFor="step-file">Görsel Yükle</label>
                  <input id="step-file" type="file" accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border border-slate-300 rounded-lg p-2 text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-slate-900 hover:file:bg-slate-100" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-medium text-sm" htmlFor="step-image">veya Görsel URL</label>
                  <input id="step-image" name="image" value={editing.image} onChange={handleStepChange}
                    placeholder="https://..."
                    className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-900 font-medium text-sm" htmlFor="step-imgalt">Görsel Alt Metin</label>
                  <input id="step-imgalt" name="imageAlt" value={editing.imageAlt} onChange={handleStepChange}
                    className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                {editing.image && !file && (
                  <div>
                    <span className="text-xs text-slate-500 mb-1 block">Mevcut görsel:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.image} alt={editing.imageAlt || ""} className="w-full max-h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors">
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button type="button" onClick={() => { setEditing(null); setFile(null); }}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg px-6 py-2.5 font-medium transition-colors">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
