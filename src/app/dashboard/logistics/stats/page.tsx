"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SectionData = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  order: number;
};

export default function LogisticsStatsAdmin() {
  const [section, setSection] = useState<SectionData | null>(null);
  const [items, setItems] = useState<StatItem[]>([]);
  const [editingItem, setEditingItem] = useState<StatItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logistics/stats");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSection({
        id: data.section.id ?? "",
        title: data.section.title ?? "",
        description: data.section.description ?? "",
        buttonText: data.section.buttonText ?? "",
        buttonLink: data.section.buttonLink ?? "",
      });
      setItems(
        (data.items ?? []).map((it: StatItem) => ({
          id: it.id,
          value: it.value,
          suffix: it.suffix ?? "",
          label: it.label,
          order: it.order,
        }))
      );
    } catch {
      toast.error("Stats verisi alınamadı!");
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
      const res = await fetch("/api/admin/logistics/stats", {
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

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    const { name, value } = e.target;
    setEditingItem({
      ...editingItem,
      [name]: name === "value" || name === "order" ? parseInt(value) || 0 : value,
    });
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logistics/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "item", ...editingItem }),
      });
      if (!res.ok) throw new Error();
      toast.success(editingItem.id ? "Güncellendi!" : "Oluşturuldu!");
      setEditingItem(null);
      await fetchData();
    } catch {
      toast.error("Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu istatistiği silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/logistics/stats?id=${id}`, { method: "DELETE" });
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
        <h2 className="text-2xl font-bold text-slate-900">Logistics Stats Yönetimi</h2>
        <p className="text-slate-500 text-sm mt-1">
          &quot;Let&apos;s See Our Progress&quot; bölümünün içeriğini ve istatistik kartlarını buradan yönetin.
        </p>
      </div>

      {/* Section Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Bölüm İçeriği</h3>
        <form onSubmit={saveSection} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="title">Başlık</label>
            <input
              id="title"
              name="title"
              value={section?.title ?? ""}
              onChange={handleSectionChange}
              placeholder="Let's See Our Progress"
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={section?.description ?? ""}
              onChange={handleSectionChange}
              rows={3}
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="buttonText">Buton Metni</label>
              <input
                id="buttonText"
                name="buttonText"
                value={section?.buttonText ?? ""}
                onChange={handleSectionChange}
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="buttonLink">Buton Link</label>
              <input
                id="buttonLink"
                name="buttonLink"
                value={section?.buttonLink ?? ""}
                onChange={handleSectionChange}
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors w-fit"
          >
            {loading ? "Kaydediliyor..." : "Bölümü Kaydet"}
          </button>
        </form>
      </div>

      {/* Stat Items */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">İstatistik Kartları</h3>
        <button
          type="button"
          onClick={() => setEditingItem({ id: "", value: 0, suffix: "", label: "", order: items.length })}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          + Yeni İstatistik
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <span className="text-2xl font-extrabold text-[#0C1D36]">
                {item.value.toLocaleString()}{item.suffix}
              </span>
              <p className="text-sm text-slate-500 mt-1">{item.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingItem({ ...item })}
                className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Item Form */}
      {editingItem && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            {editingItem.id ? "İstatistiği Düzenle" : "Yeni İstatistik Ekle"}
          </h3>
          <form onSubmit={saveItem} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="item-value">Değer</label>
                <input
                  id="item-value"
                  name="value"
                  type="number"
                  value={editingItem.value}
                  onChange={handleItemChange}
                  placeholder="323"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="item-suffix">Ek (suffix)</label>
                <input
                  id="item-suffix"
                  name="suffix"
                  value={editingItem.suffix}
                  onChange={handleItemChange}
                  placeholder="K, M, +, %"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="item-label">Etiket</label>
                <input
                  id="item-label"
                  name="label"
                  value={editingItem.label}
                  onChange={handleItemChange}
                  placeholder="Shipments Delivered"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="item-order">Sıra</label>
                <input
                  id="item-order"
                  name="order"
                  type="number"
                  value={editingItem.order}
                  onChange={handleItemChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg px-6 py-2.5 font-medium transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
