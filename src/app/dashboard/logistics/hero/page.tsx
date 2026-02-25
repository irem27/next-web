"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type HeroState = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  searchPlaceholder: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
};

const EMPTY: HeroState = {
  id: "",
  badge: "",
  title: "",
  subtitle: "",
  description: "",
  backgroundImage: "",
  searchPlaceholder: "",
  button1Text: "",
  button1Link: "",
  button2Text: "",
  button2Link: "",
};

export default function LogisticsHeroAdmin() {
  const [hero, setHero] = useState<HeroState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/logistics/hero");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (!mounted) return;
        setHero({
          id: data.id ?? "",
          badge: data.badge ?? "",
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          description: data.description ?? "",
          backgroundImage: data.backgroundImage ?? "",
          searchPlaceholder: data.searchPlaceholder ?? "",
          button1Text: data.button1Text ?? "",
          button1Link: data.button1Link ?? "",
          button2Text: data.button2Text ?? "",
          button2Link: data.button2Link ?? "",
        });
      } catch {
        toast.error("Hero verisi alınamadı!");
      } finally {
        if (mounted) setFetching(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHero((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      let imageUrl = hero.backgroundImage;

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "logistics");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        if (!uploadData?.url) throw new Error("Upload response missing url");
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/admin/logistics/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hero, backgroundImage: imageUrl }),
      });

      if (!res.ok) {
        toast.error("Kayıt işlemi başarısız!");
        return;
      }

      const saved = await res.json();
      setHero((prev) => ({
        ...prev,
        id: saved.id,
        backgroundImage: imageUrl,
      }));
      setFile(null);
      toast.success("Başarıyla kaydedildi!");
    } catch {
      toast.error("Bir hata oluştu!");
    } finally {
      setLoading(false);
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Logistics Hero Section Yönetimi
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Logistics landing sayfasının hero bölümünü buradan yönetebilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Badge */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="badge">
            Badge Metni
          </label>
          <input
            id="badge"
            name="badge"
            value={hero.badge}
            onChange={handleChange}
            placeholder="Ör: Leading Logistics Provider"
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="title">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            value={hero.title}
            onChange={handleChange}
            placeholder="Ör: LOGI CRAFT"
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="subtitle">
            Alt Başlık
          </label>
          <input
            id="subtitle"
            name="subtitle"
            value={hero.subtitle}
            onChange={handleChange}
            placeholder="Ör: Crafting Your Logistics Success"
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="description">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={hero.description}
            onChange={handleChange}
            placeholder="Hero bölümünün açıklama metni..."
            rows={4}
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Background Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="bgImage">
            Arka Plan Görseli
          </label>
          <input
            id="bgImage"
            name="bgImage"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-900 hover:file:bg-slate-200"
          />

          {hero.backgroundImage && !file && (
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1.5">Mevcut görsel:</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.backgroundImage}
                alt="Hero background"
                className="w-full max-h-48 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}

          {file && (
            <div className="mt-1 text-sm text-slate-600">
              Seçilen dosya: <span className="font-medium">{file.name}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-slate-900 font-medium text-sm" htmlFor="backgroundImage">
              veya Görsel URL
            </label>
            <input
              id="backgroundImage"
              name="backgroundImage"
              value={hero.backgroundImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <hr className="border-slate-200 my-2" />

        {/* Search Placeholder */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 font-medium text-sm" htmlFor="searchPlaceholder">
            Arama Placeholder Metni
          </label>
          <input
            id="searchPlaceholder"
            name="searchPlaceholder"
            value={hero.searchPlaceholder}
            onChange={handleChange}
            placeholder="Ör: Track My Shipment"
            className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <hr className="border-slate-200 my-2" />

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="button1Text">
              Buton 1 Metin
            </label>
            <input
              id="button1Text"
              name="button1Text"
              value={hero.button1Text}
              onChange={handleChange}
              placeholder="Ör: Delivery & coverage"
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="button1Link">
              Buton 1 Link
            </label>
            <input
              id="button1Link"
              name="button1Link"
              value={hero.button1Link}
              onChange={handleChange}
              placeholder="Ör: #services"
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="button2Text">
              Buton 2 Metin
            </label>
            <input
              id="button2Text"
              name="button2Text"
              value={hero.button2Text}
              onChange={handleChange}
              placeholder="Ör: Costs Calculators"
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-900 font-medium text-sm" htmlFor="button2Link">
              Buton 2 Link
            </label>
            <input
              id="button2Link"
              name="button2Link"
              value={hero.button2Link}
              onChange={handleChange}
              placeholder="Ör: #solutions"
              className="border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg p-3 font-medium mt-2 transition-colors"
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
