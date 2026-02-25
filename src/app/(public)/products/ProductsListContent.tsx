"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface SectionData {
  badgeText: string;
  title: string;
  description: string | null;
}

export default function ProductsListContent() {
  const [section, setSection] = useState<SectionData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setSection(data.section);
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredCategories = categories.map((category) => ({
    ...category,
    products: category.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Get all products for "All" tab
  const allProducts = filteredCategories.flatMap((cat) => cat.products);

  // Get current products to display
  const currentProducts = activeCategory === "all"
    ? allProducts
    : filteredCategories.find((cat) => cat.id === activeCategory)?.products || [];

  if (loading) {
    return (
      <div className="bg-[#f4f4f4] flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#868792]"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#f4f4f4]">
      {/* Hero Section */}
      <section className="bg-[#0c0f23] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[#868792] text-lg">❯❯❯❯❯</span>
              <span className="text-[#868792] font-medium text-sm tracking-wider uppercase">
                {section?.badgeText || "Alamira Products"}
              </span>
              <span className="text-[#868792] text-lg">❮❮❮❮❮</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
              {section?.title || "Pure Products And Honest Practices"}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {section?.description ||
                "Discover our premium collection of Basmati and Sella rice products, carefully selected for quality and taste."}
            </p>

            {/* Search */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#868792] focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeCategory === "all"
                    ? "bg-[#868792] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                    activeCategory === category.id
                      ? "bg-[#868792] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? "Ürün bulunamadı" : "Henüz ürün eklenmemiş"}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery
                  ? "Farklı bir arama terimi deneyin"
                  : "Yakında yeni ürünler eklenecek"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image || "/images/product-placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white text-[#0c0f23] px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-[#0c0f23] text-sm sm:text-base line-clamp-2 min-h-[2.5rem] group-hover:text-[#868792] transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.price && (
                      <p className="text-[#868792] font-semibold mt-2">
                        {product.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Count */}
          {currentProducts.length > 0 && (
            <div className="text-center mt-12 text-gray-500">
              Showing {currentProducts.length} product
              {currentProducts.length !== 1 ? "s" : ""}
              {activeCategory !== "all" &&
                ` in ${
                  categories.find((c) => c.id === activeCategory)?.name || ""
                }`}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#0c0f23] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#868792]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#868792]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">
                Only the finest grains selected for our products
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#868792]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#868792]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">100% Organic</h3>
              <p className="text-gray-400 text-sm">
                Grown naturally without harmful chemicals
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#868792]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#868792]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Fresh Packaging</h3>
              <p className="text-gray-400 text-sm">
                Sealed fresh to preserve quality and taste
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#868792]/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#868792]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Easy to Cook</h3>
              <p className="text-gray-400 text-sm">
                Perfect results every time with simple instructions
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
