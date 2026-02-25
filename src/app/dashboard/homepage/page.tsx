"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BrandSlidesAdmin = dynamic(() => import("./brand-slides"), { ssr: false });

export default function HomepageAdminPage() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa Yönetimi</h1>
          <p className="text-gray-500 mt-1">Sadece kullanılan alanlar burada listelenir.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/homepage"
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              isActive("/dashboard/homepage")
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Brand Slides
          </Link>
          <Link
            href="/dashboard/homepage/about"
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              isActive("/dashboard/homepage/about")
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            About
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BrandSlidesAdmin />
      </div>
    </div>
  );
}
