import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiShieldUserLine,
  RiUserAddLine,
  RiTimeLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
  RiAlertLine,
} from "react-icons/ri";
import { PageHeaderOrganism } from "../../components/common/PageHeaderOrganism";
import { useAuth } from "../../providers/auth";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "marketing";
  status: "active" | "inactive";
  avatarUrl?: string;
  addedAt: string;
  lastLoginAt?: string;
}

export const AccessManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "owner" | "marketing">("marketing");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const { timeStr, dateStr } = useMemo(() => {
    const now = new Date();
    return {
      timeStr: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      dateStr: now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/access/users`);
      const json = await res.json();
      if (json.data) setUsers(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, apiUrl]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/access/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          role: formRole,
          status: formStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Akses untuk ${formEmail} berhasil ditambahkan.`);
        setFormName("");
        setFormEmail("");
        setFormRole("marketing");
        setModalOpen(false);
        await fetchUsers();
      } else {
        setNotice(data.message || "Gagal menambahkan pengguna.");
      }
    } catch {
      setNotice("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetUser: DashboardUser) => {
    const nextStatus = targetUser.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${apiUrl}/access/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetUser.id,
          role: targetUser.role,
          status: nextStatus,
        }),
      });
      setNotice(`Status ${targetUser.email} diubah menjadi ${nextStatus}.`);
      await fetchUsers();
    } catch {
      setNotice("Gagal memperbarui status pengguna.");
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Yakin ingin menghapus akses ${email}?`)) return;
    try {
      await fetch(`${apiUrl}/access/users?id=${id}`, {
        method: "DELETE",
      });
      setNotice(`Akses ${email} berhasil dihapus.`);
      await fetchUsers();
    } catch {
      setNotice("Gagal menghapus pengguna.");
    }
  };

  // 1. Guard jika BUKAN Admin
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <PageHeaderOrganism
          prefix="Pengaturan"
          title="Manajemen Akses Dashboard"
          subtitle={`${timeStr} • ${dateStr} • Otoritas Khusus Administrator`}
          subtitleIcon={<RiTimeLine size={14} />}
          showBack={true}
          backPath="/dashboard"
        />

        <div className="bg-white rounded border border-gray-200 p-8 text-center shadow shadow-gray-200 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <RiAlertLine size={28} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Akses Dibatasi Khusus Administrator</h2>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Anda saat ini masuk dengan peran <span className="font-bold text-gray-800 uppercase">{user?.role || "Pengguna"}</span>. Halaman pengelolaan hak akses pengguna Google SSO hanya dapat dikonfigurasi oleh Administrator Sistem PT BRM.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Kembali ke Dashboard Utama
          </button>
        </div>
      </div>
    );
  }

  // 2. Tampilan Admin
  return (
    <div className="space-y-4">
      <PageHeaderOrganism
        prefix="Pengaturan"
        title="Manajemen Akses Pengguna"
        subtitle={`${timeStr} • ${dateStr} • Kelola Whitelist Akun Google SSO yang Diizinkan Masuk`}
        subtitleIcon={<RiTimeLine size={14} />}
        showBack={true}
        backPath="/dashboard"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RiUserAddLine size={15} />
            <span>Tambah Akses Baru</span>
          </button>
        }
      />

      {/* Alert Notice */}
      {notice && (
        <div className="p-3 rounded border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer">
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      {/* Statistik Akses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Akun Whitelist</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="w-9 h-9 rounded bg-[#8B6914]/10 text-[#8B6914] flex items-center justify-center">
            <RiShieldUserLine size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Administrator &amp; Owner</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {users.filter((u) => u.role === "admin" || u.role === "owner").length}
            </p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RiShieldCheckLine size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 shadow shadow-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Staf Marketing Terdaftar</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {users.filter((u) => u.role === "marketing").length}
            </p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
            <RiUserAddLine size={18} />
          </div>
        </div>
      </div>

      {/* Tabel Pengguna (DataTable Style) */}
      <div className="flex flex-col shadow shadow-gray-300">
        <div className="rounded-t border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-max w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Nama &amp; Akun Google
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Peran / Hak Akses
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Waktu Didaftarkan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Aktivitas Masuk
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 select-none whitespace-nowrap">
                    Kelola
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                      Memuat daftar pengguna...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                      Belum ada pengguna whitelist yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  users.map((u, rowIdx) => (
                    <tr
                      key={u.id}
                      className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-blue-50/30 ${
                        rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#8B6914] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">{u.name}</p>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            u.role === "admin"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : u.role === "owner"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {u.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(u.addedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Belum pernah"}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className="px-2 py-1 rounded text-[11px] font-semibold border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                        >
                          {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="px-2 py-1 rounded text-[11px] font-semibold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                          title="Hapus Akses"
                        >
                          <RiDeleteBinLine size={13} className="inline mr-1" />
                          <span>Hapus</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-3 bg-white border border-t-0 border-gray-200 rounded-b text-xs text-gray-500 flex items-center justify-between">
          <span>* Pengguna yang terdaftar diizinkan login dengan akun Google resminya.</span>
          <span className="font-semibold text-gray-700">Total: {users.length} Akun</span>
        </div>
      </div>

      {/* Modal Tambah Akses */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#8B6914]/10 text-[#8B6914] flex items-center justify-center">
                  <RiUserAddLine size={15} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Tambah Akun Whitelist Baru</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer">
                <RiCloseLine size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Lengkap Pengguna <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Rian Anggara"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 focus:border-[#8B6914]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Akun Google <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Contoh: nama@bumirekayasamandiri.co.id"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 focus:border-[#8B6914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Peran / Hak Akses
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 focus:border-[#8B6914]"
                  >
                    <option value="marketing">MARKETING (Lihat & Download)</option>
                    <option value="owner">OWNER (Lihat & Rekap WA)</option>
                    <option value="admin">ADMIN (Semua Hak Akses)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status Akses
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20 focus:border-[#8B6914]"
                  >
                    <option value="active">AKTIF (Dapat Masuk)</option>
                    <option value="inactive">NONAKTIF (Blokir)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#8B6914] text-white hover:bg-[#6B5010] rounded text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  {submitting ? "Menyimpan..." : "Simpan Akses"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
