// src/pages/Pengumuman.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

const EMPTY = { judul: "", isi: "", tanggal: "", aktif: true };

export default function PengumumanAdmin() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [edit, setEdit]       = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState("");
  const [delId, setDelId]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pengumuman");
      setData(res.data.data || []);
    } catch { setData([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd = () => {
    setEdit(null);
    const today = new Date().toISOString().split("T")[0];
    setForm({ ...EMPTY, tanggal: today });
    setModal(true);
  };
  const openEdit = (row) => {
    setEdit(row);
    setForm({
      judul: row.judul,
      isi: row.isi,
      tanggal: row.tanggal?.split("T")[0] || "",
      aktif: row.aktif,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.judul || !form.isi || !form.tanggal) { showToast("❌ Semua kolom wajib diisi!"); return; }
    setSaving(true);
    try {
      if (edit) {
        await api.put(`/pengumuman/${edit.id}`, form);
        showToast("✅ Pengumuman berhasil diperbarui!");
      } else {
        await api.post("/pengumuman", form);
        showToast("✅ Pengumuman berhasil ditambahkan!");
      }
      setModal(false); load();
    } catch (err) { showToast("❌ " + (err.response?.data?.message || "Gagal menyimpan")); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pengumuman/${delId}`);
      showToast("✅ Pengumuman berhasil dihapus!"); setDelId(null); load();
    } catch { showToast("❌ Gagal menghapus."); setDelId(null); }
  };

  const formatTanggal = (t) => {
    if (!t) return "-";
    return new Date(t).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const inp = "border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-teal-500";

  return (
    <div className="p-6">
      {toast && (
        <div style={{ position:"fixed", top:20, right:24, zIndex:9999, background:"#005461", color:"white", padding:"12px 20px", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", fontSize:14 }}>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengumuman</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pengumuman & informasi terkini gereja</p>
        </div>
        <button onClick={openAdd} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Tambah Pengumuman
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Belum ada pengumuman. Tambahkan yang pertama!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map(row => (
            <div key={row.id} className="bg-white rounded-xl shadow p-5 border-l-4" style={{ borderColor: row.aktif ? "#249e94" : "#d1d5db" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ background: row.aktif ? "#d1fae5" : "#fee2e2", color: row.aktif ? "#065f46" : "#991b1b", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>
                      {row.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                    <span className="text-xs text-gray-400">{formatTanggal(row.tanggal)}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">{row.judul}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{row.isi}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(row)} className="text-sm text-teal-600 hover:text-teal-800 font-semibold border border-teal-200 px-3 py-1 rounded-lg hover:bg-teal-50">Edit</button>
                  <button onClick={() => setDelId(row.id)} className="text-sm text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"white", borderRadius:16, padding:32, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{edit ? "Edit Pengumuman" : "Tambah Pengumuman"}</h2>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Judul *</label>
              <input className={inp} value={form.judul} onChange={e => setForm(f => ({...f, judul: e.target.value}))} placeholder="cth: Ibadah Hari Roh Kudus" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Tanggal *</label>
              <input type="date" className={inp} value={form.tanggal} onChange={e => setForm(f => ({...f, tanggal: e.target.value}))} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Isi Pengumuman *</label>
              <textarea rows={5} className={inp} style={{ resize:"vertical" }} value={form.isi} onChange={e => setForm(f => ({...f, isi: e.target.value}))} placeholder="Tuliskan isi pengumuman secara lengkap..." />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Status</label>
              <select className={inp} value={form.aktif ? "1" : "0"} onChange={e => setForm(f => ({...f, aktif: e.target.value === "1"}))}>
                <option value="1">Aktif (tampil di website)</option>
                <option value="0">Nonaktif (sembunyikan)</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? "Menyimpan..." : (edit ? "Simpan Perubahan" : "Tambah")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      {delId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"white", borderRadius:16, padding:32, maxWidth:360, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Pengumuman?</h3>
            <p className="text-gray-500 text-sm mb-6">Pengumuman ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
