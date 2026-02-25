"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type HeroState = {
  title: string;
  description: string;
  image: string; // existing image URL
};

export default function GrainfoodHeroAdmin() {
  const [hero, setHero] = useState<HeroState>({
    title: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/hero?brand=grainfood", { method: "GET" });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();

        if (!isMounted) return;

        if (data) {
          setHero({
            title: data.title ?? "",
            description: data.description ?? "",
            image: data.image ?? "",
          });
        }
      } catch {
        toast.error("Hero verisi alınamadı!");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      let imageUrl = hero.image;

      // Upload new file if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "grainfood");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }

        const uploadData = await uploadRes.json();
        if (!uploadData?.url) {
          throw new Error("Upload response missing url");
        }

        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/admin/hero?brand=grainfood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hero, image: imageUrl }),
      });

      if (!res.ok) {
        toast.error("Kayıt işlemi başarısız!");
        return;
      }

      // Update local state with latest image URL (if uploaded)
      setHero((prev) => ({ ...prev, image: imageUrl }));
      setFile(null);

      toast.success("Başarıyla kaydedildi!");
    } catch (err) {
      toast.error("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-4 text-slate-900">
        Grainfood Hero Section Yönetimi
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-slate-900 font-medium" htmlFor="title">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            value={hero.title}
            onChange={handleChange}
            placeholder="Başlık"
            className="border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-900 font-medium" htmlFor="description">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={hero.description}
            onChange={handleChange}
            placeholder="Açıklama"
            rows={5}
            className="border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-900 font-medium" htmlFor="image">
            Görsel Yükle
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-slate-300 rounded p-2 text-slate-900 file:mr-4 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-900 hover:file:bg-slate-200"
          />

          {/* Existing image preview */}
          {hero.image && !file && (
            <div className="mt-2">
              <div className="text-sm text-slate-600 mb-2">Mevcut görsel:</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.image}
                alt="Grainfood hero"
                className="w-full max-h-64 object-cover rounded border border-slate-200"
              />
            </div>
          )}

          {/* New file preview (optional) */}
          {file && (
            <div className="mt-2 text-sm text-slate-600">
              Seçilen dosya: <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded p-2"
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}