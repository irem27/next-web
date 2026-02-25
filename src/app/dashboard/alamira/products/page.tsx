"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Helper function to validate image paths
function getValidImageSrc(src: string | null | undefined, fallback: string): string {
  if (!src || src.trim() === '') return fallback
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  return fallback
}

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  _count?: { products: number };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: string | null;
  categoryId: string;
  order: number;
  isActive: boolean;
  category?: Category;
}

interface SectionSettings {
  id: string;
  badgeText: string;
  title: string;
  description: string | null;
  buttonText: string;
  buttonLink: string;
}

export default function ProductsEditPage() {
  const [section, setSection] = useState<SectionSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "categories" | "products">("settings");
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionRes, categoriesRes, productsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/products/categories"),
        fetch("/api/admin/products/items"),
      ]);

      if (sectionRes.ok) {
        const data = await sectionRes.json();
        setSection(data.section);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data);
      }
    } catch {
      setMessage({ type: "error", text: "Veri yüklenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async () => {
    if (!section) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Ayarlar kaydedildi!" });
      } else {
        setMessage({ type: "error", text: "Kaydetme hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setSaving(false);
    }
  };

  const saveCategory = async () => {
    if (!editingCategory) return;
    setSaving(true);

    try {
      const isNew = !editingCategory.id;
      const res = await fetch("/api/admin/products/categories", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      if (res.ok) {
        setMessage({ type: "success", text: isNew ? "Kategori eklendi!" : "Kategori güncellendi!" });
        setShowCategoryModal(false);
        setEditingCategory(null);
        fetchData();
      } else {
        setMessage({ type: "error", text: "İşlem hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Kategoriye ait tüm ürünler de silinecek.")) return;

    try {
      const res = await fetch(`/api/admin/products/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Kategori silindi!" });
        fetchData();
      } else {
        setMessage({ type: "error", text: "Silme hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);

    try {
      const isNew = !editingProduct.id;
      const res = await fetch("/api/admin/products/items", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        setMessage({ type: "success", text: isNew ? "Ürün eklendi!" : "Ürün güncellendi!" });
        setShowProductModal(false);
        setEditingProduct(null);
        fetchData();
      } else {
        setMessage({ type: "error", text: "İşlem hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/products/items?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Ürün silindi!" });
        fetchData();
      } else {
        setMessage({ type: "error", text: "Silme hatası" });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditingProduct({ ...editingProduct, image: data.url });
      } else {
        setMessage({ type: "error", text: "Resim yüklenirken hata oluştu" });
      }
    } catch {
      setMessage({ type: "error", text: "Resim yükleme hatası" });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A853]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Ürünler Yönetimi</h1>
        <p className="text-slate-600 mt-1">Ürün kategorileri ve ürünleri yönetin.</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {[
          { id: "settings", label: "Bölüm Ayarları" },
          { id: "categories", label: "Kategoriler" },
          { id: "products", label: "Ürünler" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-medium text-sm border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-[#D4A853] text-[#D4A853]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && section && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Badge Metni</label>
              <input
                type="text"
                value={section.badgeText}
                onChange={(e) => setSection({ ...section, badgeText: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => setSection({ ...section, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
              <textarea
                value={section.description || ""}
                onChange={(e) => setSection({ ...section, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Buton Metni</label>
              <input
                type="text"
                value={section.buttonText}
                onChange={(e) => setSection({ ...section, buttonText: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Buton Linki</label>
              <input
                type="text"
                value={section.buttonLink}
                onChange={(e) => setSection({ ...section, buttonLink: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveSection}
              disabled={saving}
              className="px-6 py-3 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Kategoriler</h2>
            <button
              onClick={() => {
                setEditingCategory({ id: "", name: "", slug: "", order: categories.length, isActive: true });
                setShowCategoryModal(true);
              }}
              className="px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Kategori
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-slate-900">{cat.name}</h3>
                  <p className="text-sm text-slate-500">Slug: {cat.slug} • {cat._count?.products || 0} ürün</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowCategoryModal(true);
                    }}
                    className="p-2 text-slate-600 hover:text-[#D4A853] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Ürünler</h2>
            <button
              onClick={() => {
                setEditingProduct({
                  id: "",
                  name: "",
                  description: null,
                  image: null,
                  price: null,
                  categoryId: categories[0]?.id || "",
                  order: products.length,
                  isActive: true,
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="relative aspect-square bg-slate-100">
                  {product.image && getValidImageSrc(product.image, '') ? (
                    <Image src={getValidImageSrc(product.image, '/images/placeholder.jpg')} alt={product.name} fill className="object-contain p-4" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.category?.name}</p>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductModal(true);
                      }}
                      className="p-2 text-slate-600 hover:text-[#D4A853] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {editingCategory.id ? "Kategori Düzenle" : "Yeni Kategori"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori Adı</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sıra</label>
                <input
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg my-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {editingProduct.id ? "Ürün Düzenle" : "Yeni Ürün"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Adı</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                <textarea
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fiyat</label>
                <input
                  type="text"
                  value={editingProduct.price || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                  placeholder="₺99.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Görseli</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  {editingProduct.image && getValidImageSrc(editingProduct.image, '') ? (
                    <div className="relative aspect-square w-32 mx-auto mb-4">
                      <Image src={getValidImageSrc(editingProduct.image, '/images/placeholder.jpg')} alt="Product" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                      {uploadingImage ? "Yükleniyor..." : "Resim Yükle"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                onClick={saveProduct}
                disabled={saving}
                className="px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
