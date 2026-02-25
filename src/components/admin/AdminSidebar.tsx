"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */
type MenuItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

type MenuGroup = {
  title: string;
  icon: ReactNode;
  items: MenuItem[];
};

/* -----------------------------------------------------------------------------
 * Menu Definitions
 * -------------------------------------------------------------------------- */
const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
];

const homepageGroup: MenuGroup = {
  title: "Ana Sayfa",
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  items: [
    {
      title: "Brand Slides",
      href: "/dashboard/homepage",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      ),
    },
    {
      title: "About",
      href: "/dashboard/homepage/about",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ],
};

const alamiraGroup: MenuGroup = {
  title: "Alamira Rice",
  icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  items: [
    {
      title: "Hero Section",
      href: "/dashboard/alamira/hero",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "About Section",
      href: "/dashboard/alamira/about",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Products",
      href: "/dashboard/alamira/products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: "Instagram",
      href: "/dashboard/alamira/instagram",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Blog / Recipes",
      href: "/dashboard/alamira/blog",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      title: "Footer",
      href: "/dashboard/alamira/footer",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15h18" />
        </svg>
      ),
    },
    {
      title: "Contact",
      href: "/dashboard/alamira/contact",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ],
};

const logisticsGroup: MenuGroup = {
  title: "Logistics",
  icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h.008M21 12.75V6.375c0-.621-.504-1.125-1.125-1.125H12.25l-2.5-3H5.625c-.621 0-1.125.504-1.125 1.125v10.875" />
    </svg>
  ),
  items: [
    {
      title: "Hero Section",
      href: "/dashboard/logistics/hero",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "About Section",
      href: "/dashboard/logistics/about",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Services",
      href: "/dashboard/logistics/services",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      title: "Stats",
      href: "/dashboard/logistics/stats",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "How We Work",
      href: "/dashboard/logistics/process",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      title: "Marquee",
      href: "/dashboard/logistics/marquee",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Latest News",
      href: "/dashboard/logistics/news",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      title: "Footer",
      href: "/dashboard/logistics/footer",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15h18" />
        </svg>
      ),
    },
  ],
};

const bottomMenuItems: MenuItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Kullanıcılar",
    href: "/dashboard/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

/* -----------------------------------------------------------------------------
 * Component
 * -------------------------------------------------------------------------- */
export default function AdminSidebar() {
  // Tüm sidebar dışı alanlar için koyu font rengi
  // Sidebar içerikleri (menü başlıkları, linkler) hariç
  // Ana wrapper'a text-[#1a1a1a] ekleniyor
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isHomepageActive = useMemo(() => pathname.startsWith("/dashboard/homepage"), [pathname]);
  const isAlamiraActive = useMemo(() => pathname.startsWith("/dashboard/alamira"), [pathname]);
  const isLogisticsActive = useMemo(() => pathname.startsWith("/dashboard/logistics"), [pathname]);

  const [isHomepageOpen, setIsHomepageOpen] = useState<boolean>(isHomepageActive);
  const [isAlamiraOpen, setIsAlamiraOpen] = useState<boolean>(isAlamiraActive);
  const [isLogisticsOpen, setIsLogisticsOpen] = useState<boolean>(isLogisticsActive);

  return (
    <aside
      className={`bg-slate-900 min-h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } text-[#1a1a1a] border-[#ccc]`}
      style={{ color: '#1a1a1a', borderColor: '#ccc' }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[#ccc]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {!isCollapsed && (
            <div>
              <span className="text-white font-bold text-lg">IM Admin</span>
              <span className="block text-slate-400 text-xs">İçerik Yönetimi</span>
            </div>
          )}
        </Link>
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed((v) => !v)}
        className="w-full p-3 text-[#1a1a1a] hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
      >
        <svg
          className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto border-[#ccc]" style={{ color: '#1a1a1a', borderColor: '#ccc' }}>
        {/* Main Menu Items */}
        <ul className="space-y-2">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Homepage Group */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setIsHomepageOpen((v) => !v)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
              isHomepageActive ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {homepageGroup.icon}
              {!isCollapsed && <span className="font-medium">{homepageGroup.title}</span>}
            </div>

            {!isCollapsed && (
              <svg
                className={`w-4 h-4 transition-transform ${isHomepageOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {(isHomepageOpen || isCollapsed) && (
            <ul className={`space-y-1 ${isCollapsed ? "mt-2" : "mt-1 ml-4 border-l border-slate-700"}`}>
              {homepageGroup.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Projects label */}
        <div className="mt-6">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projeler
            </div>
          )}

          {/* Alamira Group */}
          <button
            type="button"
            onClick={() => setIsAlamiraOpen((v) => !v)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
              isAlamiraActive ? "bg-[#D4A853]/20 text-[#D4A853]" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {alamiraGroup.icon}
              {!isCollapsed && <span className="font-medium">{alamiraGroup.title}</span>}
            </div>

            {!isCollapsed && (
              <svg
                className={`w-4 h-4 transition-transform ${isAlamiraOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {(isAlamiraOpen || isCollapsed) && (
            <ul className={`space-y-1 ${isCollapsed ? "mt-2" : "mt-1 ml-4 border-l border-slate-700"}`}>
              {alamiraGroup.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive ? "bg-[#D4A853] text-slate-900" : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Logistics Group */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsLogisticsOpen((v) => !v)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                isLogisticsActive ? "bg-emerald-500/20 text-emerald-500" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {logisticsGroup.icon}
                {!isCollapsed && <span className="font-medium">{logisticsGroup.title}</span>}
              </div>

              {!isCollapsed && (
                <svg
                  className={`w-4 h-4 transition-transform ${isLogisticsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {(isLogisticsOpen || isCollapsed) && (
              <ul className={`space-y-1 ${isCollapsed ? "mt-2" : "mt-1 ml-4 border-l border-slate-700"}`}>
                {logisticsGroup.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          isActive ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {item.icon}
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Menu Items */}
        <div className="mt-6 pt-6 border-t border-[#ccc]">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sistem
            </div>
          )}
          <ul className="space-y-2">
            {bottomMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-[#ccc]">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {!isCollapsed && <span>Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  );
}