"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BrandSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  backgroundImage: string | null;
  theme: string;
  accentColor: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function BrandSlidesAdmin() {
  const [slides, setSlides] = useState<BrandSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<BrandSlide | null>(null);
  const [newSlide, setNewSlide] = useState<Partial<BrandSlide>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const res = await fetch("/api/admin/homepage/brand-slides");
    if (res.ok) setSlides(await res.json());
  };

  const saveSlide = async (slide: Partial<BrandSlide>) => {
    setSavingSlide(true);
    const isEdit = slide.id && slide.id.length > 0;
    const res = await fetch("/api/admin/homepage/brand-slides", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    setSavingSlide(false);
    if (res.ok) {
      setEditingSlide(null);
      setNewSlide({});
      fetchSlides();
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Bu slide'ı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/homepage/brand-slides?id=${id}`, { method: "DELETE" });
    fetchSlides();
  };

  // Görsel upload handler
  const handleImageUpload = async (file: File, cb: (url: string) => void) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    setUploadingImage(false);
    if (res.ok) {
      const data = await res.json();
      cb(data.url);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Brand Slides Yönetimi</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditingSlide({
          id: "",
          title: "",
          subtitle: "",
          description: "",
          buttonText: "",
          buttonLink: "",
          backgroundImage: "",
          theme: "dark",
          accentColor: "blue",
          icon: "default",
          order: slides.length,
          isActive: true,
        })}
      >Yeni Slide Ekle</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map(slide => (
          <div key={slide.id} className="border rounded p-4 bg-white shadow">
            <div className="mb-2 font-bold text-lg">{slide.title}</div>
            {slide.backgroundImage && (
              <Image src={slide.backgroundImage} alt={slide.title} width={300} height={120} className="rounded mb-2 object-cover" />
            )}
            <div className="mb-2">{slide.subtitle}</div>
            <div className="mb-2 text-sm text-gray-600">{slide.description}</div>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => setEditingSlide(slide)}>Düzenle</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteSlide(slide.id)}>Sil</button>
          </div>
        ))}
      </div>
      {editingSlide && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setEditingSlide(null)}>×</button>
            <h3 className="text-xl font-bold mb-4">Slide Düzenle</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                saveSlide(editingSlide);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Başlık"
                value={editingSlide.title || ""}
                onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Alt Başlık"
                value={editingSlide.subtitle || ""}
                onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                placeholder="Açıklama"
                value={editingSlide.description || ""}
                onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Buton Metni"
                value={editingSlide.buttonText || ""}
                onChange={e => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Buton Link"
                value={editingSlide.buttonLink || ""}
                onChange={e => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <div>
                <label className="block mb-1">Arka Plan Görseli</label>
                {editingSlide.backgroundImage && (
                  <Image src={editingSlide.backgroundImage} alt="bg" width={200} height={80} className="rounded mb-2 object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file, url => setEditingSlide({ ...editingSlide, backgroundImage: url }));
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={editingSlide.brand || "alamira"}
                  onChange={e => setEditingSlide({ ...editingSlide, brand: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="alamira">Alamira</option>
                  <option value="grainfood">Grainfood</option>
                </select>
                <select
                  value={editingSlide.theme}
                  onChange={e => setEditingSlide({ ...editingSlide, theme: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="light">Açık Tema</option>
                  <option value="dark">Koyu Tema</option>
                </select>
                <select
                  value={editingSlide.accentColor}
                  onChange={e => setEditingSlide({ ...editingSlide, accentColor: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="orange">Turuncu</option>
                  <option value="blue">Mavi</option>
                  <option value="green">Yeşil</option>
                  <option value="purple">Mor</option>
                  <option value="red">Kırmızı</option>
                </select>
                <select
                  value={editingSlide.icon}
                  onChange={e => setEditingSlide({ ...editingSlide, icon: e.target.value })}
                  className="border rounded px-3 py-2"
                >
                  <option value="rice">Pirinç</option>
                  <option value="logistics">Lojistik</option>
                  <option value="default">Varsayılan</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={savingSlide || uploadingImage}>Kaydet</button>
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditingSlide(null)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
