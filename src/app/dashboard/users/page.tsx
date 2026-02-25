"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingUser) {
        // Güncelleme
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingUser.id,
            ...form,
            password: form.password || undefined, // Boşsa gönderme
          }),
        });

        if (res.ok) {
          setSuccess("Kullanıcı güncellendi");
          fetchUsers();
          closeModal();
        } else {
          const data = await res.json();
          setError(data.error || "Güncelleme başarısız");
        }
      } else {
        // Yeni kullanıcı
        if (!form.password) {
          setError("Şifre zorunludur");
          return;
        }

        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setSuccess("Kullanıcı oluşturuldu");
          fetchUsers();
          closeModal();
        } else {
          const data = await res.json();
          setError(data.error || "Oluşturma başarısız");
        }
      }
    } catch {
      setError("Bir hata oluştu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Silme başarısız");
      }
    } catch {
      alert("Bir hata oluştu");
    }
  };

  const toggleActive = async (user: User) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive,
        }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch {
      alert("Bir hata oluştu");
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ email: "", password: "", name: "", role: "admin" });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      password: "",
      name: user.name || "",
      role: user.role,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm({ email: "", password: "", name: "", role: "admin" });
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A853]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-1">Admin kullanıcılarını yönetin</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kullanıcı
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kayıt Tarihi
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#D4A853] flex items-center justify-center text-white font-medium">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || "-"}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(user)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Aktif" : "Pasif"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-[#D4A853] hover:text-[#c49843] mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz kullanıcı bulunmuyor
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                  placeholder="Admin Kullanıcı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                  placeholder="admin@alamira.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editingUser ? "(Boş bırakırsanız değişmez)" : "*"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A853] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editör</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D4A853] hover:bg-[#c49843] text-white rounded-lg transition-colors"
                >
                  {editingUser ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
