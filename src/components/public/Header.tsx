"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface Settings {
  siteName: string;
  siteTagline: string;
  logo: string;
  logoAlamira: string;
  logoLogistics: string;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
}

interface SearchResult {
  type: "blog" | "product";
  title: string;
  slug?: string;
  description?: string;
  image?: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

function isValidUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function Header(props: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLogistics =
    pathname === "/" ||
    pathname.startsWith("/logistics") ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/impressum") ||
    pathname.startsWith("/cookies") ||
    pathname.startsWith("/datenschutz");

  const socialLinks = [
    {
      name: "Facebook",
      href: settings?.facebook,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: settings?.instagram,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: settings?.youtube,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: settings?.twitter,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: settings?.linkedin,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.077V9h3.112v1.561h.044c.434-.824 1.494-1.694 3.073-1.694 3.289 0 3.895 2.165 3.895 4.977v6.608zM5.337 7.433a1.812 1.812 0 110-3.624 1.812 1.812 0 010 3.624zM6.956 20.452H3.716V9h3.24v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ].filter((s) => isValidUrl(s.href));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Search in blogs and products
      const [blogRes, productRes] = await Promise.all([
        fetch(`/api/blog?search=${encodeURIComponent(query)}`),
        fetch(`/api/products?search=${encodeURIComponent(query)}`)
      ]);

      const results: SearchResult[] = [];

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        const blogs = Array.isArray(blogData) ? blogData : blogData.posts || [];
        blogs.slice(0, 3).forEach((blog: { title: string; slug: string; excerpt?: string; featuredImage?: string }) => {
          results.push({
            type: "blog",
            title: blog.title,
            slug: blog.slug,
            description: blog.excerpt,
            image: blog.featuredImage
          });
        });
      }

      if (productRes.ok) {
        const productData = await productRes.json();
        const products = Array.isArray(productData) ? productData : productData.items || [];
        products.slice(0, 3).forEach((product: { name: string; slug?: string; description?: string; image?: string }) => {
          results.push({
            type: "product",
            title: product.name,
            slug: product.slug,
            description: product.description,
            image: product.image
          });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery("");
    setIsSearchOpen(false);
    
    if (result.type === "blog" && result.slug) {
      router.push(`/blog/${result.slug}`);
    } else if (result.type === "product") {
      router.push("/products");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      setIsSearchOpen(false);
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#f4f4f4] px-4 sm:px-6 lg:px-12 py-4 sm:py-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            if (props.onMenuClick) props.onMenuClick();
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300 transition-all"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          {(() => {
            const activeLogo = isLogistics ? settings?.logoLogistics : settings?.logoAlamira;
            const fallbackLogo = settings?.logo;
            const logoSrc = activeLogo || fallbackLogo;

            if (logoSrc) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt={settings?.siteName || "Logo"} className="h-8 sm:h-10 lg:h-12 w-auto object-contain" />
              );
            }

            return (
              <span className="text-gray-900 text-lg sm:text-xl lg:text-2xl font-bold tracking-wider">
                {isLogistics ? "LOGISTICS" : (settings?.siteName || "ALAMIRA")}
              </span>
            );
          })()}
        </Link>

        {/* Right Side - Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-gray-800"
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
            </button>
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-white rounded-full pl-4 pr-2 py-2 min-w-[140px] lg:min-w-[180px]">
              <input
                type="text"
                placeholder="Suchen"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="bg-transparent text-gray-800 text-sm outline-none w-full placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
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
              </button>
            </form>

            {/* Desktop Search Results Dropdown */}
            {showResults && searchQuery.length >= 2 && (
              <div className="hidden sm:block absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <svg className="animate-spin h-5 w-5 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suche läuft...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                      >
                        {result.image ? (
                          <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {result.type === "blog" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              )}
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{result.type === "blog" ? "Beitrag" : "Produkt"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Keine Ergebnisse gefunden
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Media (only if configured) */}
          {socialLinks.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label={`${social.name} öffnen`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div ref={mobileSearchRef} className="sm:hidden absolute top-full left-0 right-0 p-4 bg-[#f4f4f4] shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full pl-4 pr-2 py-2">
              <input
              type="text"
              placeholder="Suchen"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent text-gray-800 text-sm outline-none w-full placeholder-gray-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-gray-600"
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
            </button>
          </form>

          {/* Mobile Search Results */}
          {showResults && searchQuery.length >= 2 && (
            <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <svg className="animate-spin h-5 w-5 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suche läuft...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                    >
                      {result.image ? (
                        <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {result.type === "blog" ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            )}
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{result.type === "blog" ? "Beitrag" : "Produkt"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Keine Ergebnisse gefunden
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
