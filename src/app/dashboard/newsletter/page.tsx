"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Subscriber = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsletterPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = filter === "all" ? "" : `?active=${filter === "active" ? "true" : "false"}`;
      const res = await fetch(`/api/admin/newsletter${qs}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Aboneler getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => s.email.toLowerCase().includes(q));
  }, [items, query]);

  const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);
  const inactiveCount = useMemo(() => items.filter((i) => !i.isActive).length, [items]);

  const toggleActive = async (id: string, next: boolean) => {
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: next }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: next } : p)));
      toast.success(next ? "Aktif edildi." : "Pasif edildi.");
    } catch {
      toast.error("Güncellenemedi.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu e-posta aboneliğini silmek istiyor musunuz?")) return;
    try {
      const res = await fetch(`/api/admin/newsletter?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Silindi.");
    } catch {
      toast.error("Silinemedi.");
    }
  };

  const exportCsv = () => {
    const rows = filtered.map((s) => ({
      email: s.email,
      isActive: s.isActive ? "true" : "false",
      createdAt: s.createdAt,
    }));

    const header = ["email", "isActive", "createdAt"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header
          .map((k) => {
            const v = (r as any)[k] ?? "";
            const escaped = String(v).replace(/\"/g, "\"\"");
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Aboneleri</h1>
          <p className="text-gray-500 mt-1">Footer’daki e-posta abonelik listesini buradan yönetin.</p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          CSV İndir
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Tümü ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filter === "active" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("inactive")}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filter === "inactive" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Pasif ({inactiveCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E-posta ara..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchData}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label="Yenile"
              title="Yenile"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7 9 9 0 00-14-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Kayıt bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">E-posta</th>
                  <th className="text-left font-semibold px-5 py-3">Durum</th>
                  <th className="text-left font-semibold px-5 py-3">Kayıt Tarihi</th>
                  <th className="text-right font-semibold px-5 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-medium text-gray-900">{s.email}</td>
                    <td className="px-5 py-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(s.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleActive(s.id, !s.isActive)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            s.isActive
                              ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {s.isActive ? "Pasifleştir" : "Aktifleştir"}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(s.id)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

