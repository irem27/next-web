"use client";

import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type WordItem = { id: string; word: string; order: number };

export default function LogisticsMarqueeAdmin() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [editing, setEditing] = useState<WordItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/logistics/marquee");
      if (!res.ok) throw new Error();
      setWords(await res.json());
    } catch {
      toast.error("Veriler alınamadı!");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: name === "order" ? parseInt(value) || 0 : value });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logistics/marquee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error();
      toast.success(editing.id ? "Güncellendi!" : "Eklendi!");
      setEditing(null);
      await fetchData();
    } catch {
      toast.error("Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/logistics/marquee?id=${id}`, { method: "DELETE" });
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
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Marquee Yönetimi</h2>
          <p className="text-slate-500 text-sm mt-1">Kayan yazı bandındaki kelimeleri buradan yönetin.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ id: "", word: "", order: words.length })}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          + Yeni Kelime
        </button>
      </div>

      {/* Preview */}
      <div className="bg-[#EFF6FF] rounded-xl p-4 mb-8 overflow-hidden">
        <p className="text-xs text-slate-500 mb-2 font-medium">Önizleme</p>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...words, ...words].map((w, i) => (
            <span key={`p-${i}`} className="inline-flex items-center mx-3">
              <span className={`text-[#0C1D36] text-base font-bold ${i % 3 === 0 ? "opacity-100" : i % 3 === 1 ? "opacity-30" : "opacity-60"}`}>
                {w.word}
              </span>
              <span className="mx-3 text-blue-400 text-xs">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* Words List */}
      <div className="flex flex-wrap gap-2 mb-8">
        {words.map((w) => (
          <div
            key={w.id}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:shadow-md transition-shadow"
          >
            <span className="text-xs text-slate-400 font-mono">{w.order}</span>
            <span className="font-semibold text-slate-900">{w.word}</span>
            <button type="button" onClick={() => setEditing({ ...w })}
              className="text-blue-600 hover:bg-blue-50 rounded px-1.5 py-0.5 text-xs font-medium transition-colors">
              ✎
            </button>
            <button type="button" onClick={() => remove(w.id)}
              className="text-red-500 hover:bg-red-50 rounded px-1.5 py-0.5 text-xs font-medium transition-colors">
              ✕
            </button>
          </div>
        ))}
        {words.length === 0 && (
          <p className="text-center text-slate-400 py-10 w-full">Henüz kelime eklenmemiş.</p>
        )}
      </div>

      {/* Edit / Create Form */}
      {editing && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editing.id ? "Kelimeyi Düzenle" : "Yeni Kelime Ekle"}
          </h3>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="mq-word">Kelime</label>
                <input id="mq-word" name="word" value={editing.word} onChange={handleChange}
                  placeholder="Ör: LogiCraft"
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-900 font-medium text-sm" htmlFor="mq-order">Sıra</label>
                <input id="mq-order" name="order" type="number" value={editing.order} onChange={handleChange}
                  className="border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2.5 font-medium transition-colors">
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button type="button" onClick={() => setEditing(null)}
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
