// src/pages/DashboardMajelis.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LIMIT = 12;

const DashboardMajelis = () => {
  const { user, logout } = useAuth();
  const [data, setData]               = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [detail, setDetail]           = useState(null);
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, status: "Selesai" };
      if (search) params.search = search;
      const res = await api.get("/terhubung", { params });
      setData(res.data.data.data);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    // fixed full-screen layout — tidak bergantung pada parent apapun
    <div className="fixed inset-0 flex bg-gray-100 z-0">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed di kiri, tidak pernah static di dalam parent */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">🕊️ Gereja App</div>
            <div className="text-xs text-gray-400 mt-1">Panel Majelis</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-700 transition text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm">
            <span>✅</span>
            <span>Pengajuan Selesai</span>
          </div>
          <p className="text-gray-500 text-xs px-4 pt-4 leading-relaxed">
            Anda hanya dapat melihat pengajuan yang telah diselesaikan oleh admin.
          </p>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Masuk sebagai</p>
            <p className="text-sm text-white font-semibold mt-1 truncate">{user?.nama || user?.email}</p>
            <span className="inline-block mt-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              Majelis
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main — offset manual pakai margin/padding kiri di desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-y-auto">

        {/* Topbar mobile */}
        <div className="lg:hidden flex items-center gap-3 bg-gray-900 text-white px-4 py-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold">🕊️ Gereja App</span>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          <h1 className="text-xl lg:text-2xl font-bold mb-6 text-gray-800">Dashboard Majelis</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
            <div className="bg-white shadow rounded-2xl p-4 lg:p-5 border-l-4 border-blue-200">
              <p className="text-gray-500 text-xs lg:text-sm mb-1">Total Selesai</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">{total}</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-4 lg:p-5 border-l-4 border-teal-200">
              <p className="text-gray-500 text-xs lg:text-sm mb-1">Halaman</p>
              <p className="text-2xl lg:text-3xl font-bold text-teal-600">{page} / {totalPages || 1}</p>
            </div>
            <div className="col-span-2 lg:col-span-1 bg-white shadow rounded-2xl p-4 lg:p-5 border-l-4 border-gray-200">
              <p className="text-gray-500 text-xs lg:text-sm mb-1">Mode</p>
              <p className="text-lg font-bold text-gray-500 mt-0.5">Read Only</p>
            </div>
          </div>

          {/* Tabel */}
          <div className="bg-white shadow rounded-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 lg:p-5 border-b">
              <h2 className="text-base lg:text-lg font-semibold text-gray-700">Pengajuan Selesai</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Cari nama / pelayanan..."
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 transition w-full sm:w-44"
                />
                <button type="submit"
                  className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition whitespace-nowrap">
                  Cari
                </button>
                {search && (
                  <button type="button"
                    onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition">
                    ✕
                  </button>
                )}
              </form>
            </div>

            {loading ? (
              <p className="p-8 text-center text-gray-400">Memuat data...</p>
            ) : data.length === 0 ? (
              <p className="p-8 text-center text-gray-400">Belum ada pengajuan yang selesai.</p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">Nomor HP</th>
                        <th className="px-4 py-3">Jenis Pelayanan</th>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-400">{(page - 1) * LIMIT + idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{item.namaLengkap}</td>
                          <td className="px-4 py-3 text-gray-600">{item.nomorHp}</td>
                          <td className="px-4 py-3 text-gray-600">{item.jenisPelayanan}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit", month: "short", year: "numeric"
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setDetail(item)}
                              className="text-blue-600 hover:underline text-xs font-medium">
                              Lihat →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {data.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800 text-sm">{item.namaLengkap}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 ml-2 shrink-0">
                          Selesai
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-0.5">{item.jenisPelayanan}</p>
                      <p className="text-xs text-gray-400 mb-2">
                        {item.nomorHp} · {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <button onClick={() => setDetail(item)}
                        className="text-xs text-blue-600 font-medium hover:underline">
                        Lihat Detail →
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-4 justify-end">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100">
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100">
                Next →
              </button>
            </div>
          )}

          {/* Read-only notice */}
          <div className="mt-6 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <span className="mt-0.5 shrink-0">ℹ️</span>
            <p><strong>Mode Baca Saja:</strong> Sebagai Majelis, Anda tidak dapat mengubah atau menghapus data. Hubungi admin jika ada yang perlu diubah.</p>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setDetail(null)}>
          <div className="bg-white w-full sm:rounded-2xl sm:max-w-md shadow-2xl rounded-t-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="text-base font-bold text-gray-800">Detail Pengajuan</h2>
                <p className="text-xs text-gray-400 mt-0.5">Read-only · Majelis</p>
              </div>
              <button onClick={() => setDetail(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-3 text-sm max-h-[60vh] overflow-y-auto">
              {[
                ["Nama Lengkap",    detail.namaLengkap],
                ["Nomor HP",        detail.nomorHp],
                ["Alamat",          detail.alamat || "-"],
                ["Email",           detail.email || "-"],
                ["Jenis Pelayanan", detail.jenisPelayanan],
                ["Keterangan",      detail.keterangan || "-"],
                ["Tanggal Masuk",   new Date(detail.createdAt).toLocaleString("id-ID")],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-2">
                  <span className="w-32 text-gray-500 flex-shrink-0 text-xs">{label}</span>
                  <span className="font-medium text-gray-800 text-xs">{val}</span>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <span className="w-32 text-gray-500 flex-shrink-0 text-xs">Status</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Selesai</span>
              </div>
            </div>
            <div className="p-5 border-t">
              <button onClick={() => setDetail(null)}
                className="w-full py-2.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition">
                Tutup
              </button>
        </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMajelis;