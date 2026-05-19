// src/pages/Terhubung.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_LIST = ["Pending", "Diproses", "Selesai", "Ditolak"];

const STATUS_COLOR = {
  Pending:  "bg-yellow-100 text-yellow-700",
  Diproses: "bg-blue-100 text-blue-700",
  Selesai:  "bg-green-100 text-green-700",
  Ditolak:  "bg-red-100 text-red-700",
};

const Terhubung = () => {
  const [data, setData]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [filterStatus, setFilter] = useState("");
  const [page, setPage]           = useState(1);
  const [detail, setDetail]       = useState(null); // modal detail
  const LIMIT = 15;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filterStatus) params.status = filterStatus;
      const res = await api.get("/terhubung", { params });
      setData(res.data.data.data);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/terhubung/${id}/status`, { status });
      setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      if (detail?.id === id) setDetail(prev => ({ ...prev, status }));
    } catch (err) {
      alert("Gagal memperbarui status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await api.delete(`/terhubung/${id}`);
      setData(prev => prev.filter(d => d.id !== id));
      setTotal(prev => prev - 1);
      if (detail?.id === id) setDetail(null);
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kelola Terhubung</h1>

      {/* Filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <button
          onClick={() => { setFilter(""); setPage(1); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!filterStatus ? "bg-gray-800 text-white" : "bg-white border hover:bg-gray-50"}`}
        >
          Semua ({total})
        </button>
        {STATUS_LIST.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === s ? "bg-gray-800 text-white" : "bg-white border hover:bg-gray-50"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-400">Memuat data...</p>
        ) : data.length === 0 ? (
          <p className="p-8 text-center text-gray-400">Tidak ada data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Nomor HP</th>
                  <th className="px-4 py-3">Pelayanan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{(page - 1) * LIMIT + idx + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      <button onClick={() => setDetail(item)} className="text-blue-600 hover:underline text-left">
                        {item.namaLengkap}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.nomorHp}</td>
                    <td className="px-4 py-3 text-gray-600">{item.jenisPelayanan}</td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={e => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 outline-none cursor-pointer ${STATUS_COLOR[item.status] || "bg-gray-100"}`}
                      >
                        {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Modal Detail */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold">Detail Pengajuan</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ["Nama Lengkap",    detail.namaLengkap],
                ["Nomor HP",        detail.nomorHp],
                ["Alamat",          detail.alamat],
                ["Email",           detail.email || "-"],
                ["Jenis Pelayanan", detail.jenisPelayanan],
                ["Keterangan",      detail.keterangan || "-"],
                ["Tanggal Masuk",   new Date(detail.createdAt).toLocaleString("id-ID")],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-2">
                  <span className="w-36 text-gray-500 flex-shrink-0">{label}</span>
                  <span className="font-medium text-gray-800">{val}</span>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <span className="w-36 text-gray-500 flex-shrink-0">Status</span>
                <select
                  value={detail.status}
                  onChange={e => handleStatusChange(detail.id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-3 py-1 border-0 outline-none cursor-pointer ${STATUS_COLOR[detail.status] || "bg-gray-100"}`}
                >
                  {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex justify-between">
              <button onClick={() => handleDelete(detail.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium">
                Hapus Data
              </button>
              <button onClick={() => setDetail(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terhubung;
