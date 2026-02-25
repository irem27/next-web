"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContactSection {
  id: string;
  badgeText: string;
  title: string;
  description: string | null;
  locationTitle: string;
  locationText: string;
  emailTitle: string;
  email1: string;
  email2: string | null;
  phoneTitle: string;
  phone1: string;
  phone2: string | null;
  formTitle: string;
  formDescription: string | null;
  contactImage: string | null;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  supportType: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"settings" | "messages">("settings");
  const [section, setSection] = useState<ContactSection | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionRes, submissionsRes] = await Promise.all([
        fetch("/api/admin/contact"),
        fetch("/api/admin/contact/submissions"),
      ]);

      if (sectionRes.ok) {
        const sectionData = await sectionRes.json();
        setSection(sectionData);
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });

      if (response.ok) {
        alert("Ayarlar kaydedildi!");
      } else {
        alert("Bir hata oluştu!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setSubmissions(
          submissions.map((s) => (s.id === id ? { ...s, isRead: true } : s))
        );
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/admin/contact/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İletişim Yönetimi</h1>
          <p className="text-gray-500 mt-1">
            İletişim sayfası ayarları ve gelen mesajları yönetin
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ayarlar
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === "messages"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Mesajlar
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Settings Tab */}
      {activeTab === "settings" && section && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Header Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Başlık Ayarları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Metni
                </label>
                <input
                  type="text"
                  value={section.badgeText}
                  onChange={(e) =>
                    setSection({ ...section, badgeText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    setSection({ ...section, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={section.description || ""}
                  onChange={(e) =>
                    setSection({ ...section, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Info Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              İletişim Bilgileri
            </h2>
            <div className="space-y-6">
              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konum Başlığı
                  </label>
                  <input
                    type="text"
                    value={section.locationTitle}
                    onChange={(e) =>
                      setSection({ ...section, locationTitle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konum Metni
                  </label>
                  <input
                    type="text"
                    value={section.locationText}
                    onChange={(e) =>
                      setSection({ ...section, locationText: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta Başlığı
                  </label>
                  <input
                    type="text"
                    value={section.emailTitle}
                    onChange={(e) =>
                      setSection({ ...section, emailTitle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta 1
                  </label>
                  <input
                    type="email"
                    value={section.email1}
                    onChange={(e) =>
                      setSection({ ...section, email1: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta 2
                  </label>
                  <input
                    type="email"
                    value={section.email2 || ""}
                    onChange={(e) =>
                      setSection({ ...section, email2: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon Başlığı
                  </label>
                  <input
                    type="text"
                    value={section.phoneTitle}
                    onChange={(e) =>
                      setSection({ ...section, phoneTitle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon 1
                  </label>
                  <input
                    type="text"
                    value={section.phone1}
                    onChange={(e) =>
                      setSection({ ...section, phone1: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon 2
                  </label>
                  <input
                    type="text"
                    value={section.phone2 || ""}
                    onChange={(e) =>
                      setSection({ ...section, phone2: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Form Ayarları
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Başlığı
                </label>
                <input
                  type="text"
                  value={section.formTitle}
                  onChange={(e) =>
                    setSection({ ...section, formTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Açıklaması
                </label>
                <textarea
                  value={section.formDescription || ""}
                  onChange={(e) =>
                    setSection({ ...section, formDescription: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Gelen Mesajlar ({submissions.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Henüz mesaj yok
                </div>
              ) : (
                submissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => {
                      setSelectedMessage(submission);
                      if (!submission.isRead) {
                        handleMarkAsRead(submission.id);
                      }
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === submission.id ? "bg-blue-50" : ""
                    } ${!submission.isRead ? "bg-yellow-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!submission.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          <span className="font-medium text-gray-900 truncate">
                            {submission.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {submission.email}
                        </p>
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {submission.message.substring(0, 50)}...
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(submission.createdAt).split(",")[0]}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {selectedMessage ? (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedMessage.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedMessage.email}
                      </p>
                      {selectedMessage.phone && (
                        <p className="text-sm text-gray-500">
                          {selectedMessage.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {formatDate(selectedMessage.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {selectedMessage.supportType && (
                    <div className="mt-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {selectedMessage.supportType === "general"
                          ? "Genel Soru"
                          : selectedMessage.supportType === "products"
                          ? "Ürünler"
                          : selectedMessage.supportType === "wholesale"
                          ? "Toptan Satış"
                          : selectedMessage.supportType === "partnership"
                          ? "İş Birliği"
                          : "Diğer"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Mesaj
                  </h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: İletişim Formu`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Yanıtla
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                Görüntülemek için bir mesaj seçin
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
