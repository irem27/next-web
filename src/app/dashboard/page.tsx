import Link from "next/link";

const stats = [
  { title: "Hero Section", value: "Aktif", href: "/dashboard/hero", color: "bg-green-500" },
  { title: "Ürünler", value: "3", href: "/dashboard/products", color: "bg-blue-500" },
  { title: "Blog Yazıları", value: "3", href: "/dashboard/blog", color: "bg-purple-500" },
  { title: "Instagram", value: "5", href: "/dashboard/instagram", color: "bg-pink-500" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Alamira web sitesi yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/hero"
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-[#D4A853] hover:bg-amber-50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-900">Hero Section Düzenle</p>
              <p className="text-sm text-slate-500">Ana sayfa banner içeriği</p>
            </div>
          </Link>

          <Link
            href="/dashboard/products"
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-[#D4A853] hover:bg-amber-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-900">Ürün Ekle</p>
              <p className="text-sm text-slate-500">Yeni ürün oluştur</p>
            </div>
          </Link>

          <Link
            href="/dashboard/blog"
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-[#D4A853] hover:bg-amber-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-900">Blog Yazısı Ekle</p>
              <p className="text-sm text-slate-500">Yeni tarif veya yazı</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Site Preview */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Site Önizleme</h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4A853] hover:underline text-sm flex items-center gap-1"
          >
            Siteyi Görüntüle
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
          <iframe
            src="/"
            className="w-full h-full rounded-lg"
            title="Site Preview"
          />
        </div>
      </div>
    </div>
  );
}
