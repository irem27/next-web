"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ServiceItem = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
};

const EMPTY_ITEM: Omit<ServiceItem, "id" | "order"> & { id: string; order: number } = {
  id: "",
  number: "",
  label: "",
  title: "",
  description: "",
  buttonText: "More Info",
  buttonLink: "#contact",
  order: 0,
};

export default function LogisticsServicesAdmin() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logistics/services");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Servis verileri alınamadı!");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/logistics/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        toast.error("Kayıt başarısız!");
        return;
      }
      toast.success(editing.id ? "Güncellendi!" : "Oluşturuldu!");
      setEditing(null);
      await fetchItems();
    } catch {
      toast.error("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu servisi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/logistics/services?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Silme başarısız!");
        return;
      }
      toast.success("Silindi!");
      await fetchItems();
    } catch {
      toast.error("Bir hata oluştu!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing((prev) => (prev ? { ...prev, [name]: name === "order" ? parseInt(value) || 0 : value } : null));
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Logistics Services Yönetimi
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Soldaki sekme öğeleri ve sağ taraftaki içerikleri buradan yönetebilirsiniz.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              ...EMPTY_ITEM,
              number: String(items.length + 1).padStart(2, "0"),
              order: items.length,
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          + Yeni Servis
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-extrabold text-slate-300 w-10 text-center">
                {item.number}
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{item.label}</h3>
                <p className="text-sm text-slate-500 line-clamp-1 max-w-md">
                  {item.title.replace(/\n/g, " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditing({ ...item })}
                className="text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-slate-400 py-10">Henüz servis eklenmemiş.</p>
        )}
      </div>

      {/* Edit / Create Form */}
      {editing && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            {editing.id ? "Servisi Düzenle" : "Yeni Servis Ekle"}
          </h3>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="number">
                  Numara
                </label>
                <input
                  id="number"
                  name="number"
                  value={editing.number}
                  onChange={handleChange}
                  placeholder="01"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="label">
                  Etiket (sol taraf)
                </label>
                <input
                  id="label"
                  name="label"
                  value={editing.label}
                  onChange={handleChange}
                  placeholder="Ör: By Road"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="order">
                  Sıra
                </label>
                <input
                  id="order"
                  name="order"
                  type="number"
                  value={editing.order}
                  onChange={handleChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="title">
                Başlık (sağ taraf)
              </label>
              <textarea
                id="title"
                name="title"
                value={editing.title}
                onChange={handleChange}
                placeholder="Her satır yeni bir satırda görünür"
                rows={3}
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
              <span className="text-xs text-slate-400">Her satır ayrı bir satır olarak gösterilir.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-900 font-medium text-sm" htmlFor="description">
                Açıklama (sağ taraf)
              </label>
              <textarea
                id="description"
                name="description"
                value={editing.description}
                onChange={handleChange}
                placeholder="Servis açıklaması..."
                rows={4}
                className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="buttonText">
                  Buton Metni
                </label>
                <input
                  id="buttonText"
                  name="buttonText"
                  value={editing.buttonText}
                  onChange={handleChange}
                  placeholder="More Info"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="buttonLink">
                  Buton Link
                </label>
                <input
                  id="buttonLink"
                  name="buttonLink"
                  value={editing.buttonLink}
                  onChange={handleChange}
                  placeholder="#contact"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
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
