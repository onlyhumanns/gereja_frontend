// src/pages/LiveStreaming.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

const EMPTY = { judul: "", youtubeUrl: "", deskripsi: "", aktif: true };

const toEmbedUrl = (url) => {
  if (!url) return "";
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/);
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`;
  if (url.includes("/embed/")) return url;
  return url;
};

export default function LiveStreamingAdmin() {
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
      const res = await api.get("/livestreaming");
      setData(res.data.data || []);
    } catch { setData([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setModal(true); };
  const openEdit = (row) => {
    setEdit(row);
    setForm({ judul: row.judul, youtubeUrl: row.youtubeUrl, deskripsi: row.deskripsi || "", aktif: row.aktif });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.judul || !form.youtubeUrl) { showToast("❌ Judul dan URL YouTube wajib diisi!"); return; }
    setSaving(true);
    try {
      if (edit) {
        await api.put(`/livestreaming/${edit.id}`, form);
        showToast("✅ Live streaming berhasil diperbarui!");
      } else {
        await api.post("/livestreaming", form);
        showToast("✅ Live streaming berhasil ditambahkan!");
      }
      setModal(false); load();
    } catch (err) { showToast("❌ " + (err.response?.data?.message || "Gagal menyimpan")); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/livestreaming/${delId}`);
      showToast("✅ Berhasil dihapus!"); setDelId(null); load();
    } catch { showToast("❌ Gagal menghapus."); setDelId(null); }
  };

  const inp = "border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-teal-500";
  const embedPreview = toEmbedUrl(form.youtubeUrl);

  return (
    <div className="p-6">
      {toast && (
        <div style={{ position:"fixed", top:20, right:24, zIndex:9999, background:"#005461", color:"white", padding:"12px 20px", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", fontSize:14 }}>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Streaming</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola link YouTube live streaming gereja</p>
        </div>
        <button onClick={openAdd} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          ▶ Tambah Live
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
        💡 <strong>Tips:</strong> Masukkan URL YouTube biasa (youtube.com/watch?v=... atau youtu.be/...) atau URL siaran langsung. Sistem akan otomatis mengubahnya menjadi embed. Hanya 1 live streaming yang aktif akan tampil di website.
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Belum ada live streaming. Tambahkan sekarang!</div>
      ) : (
        <div className="grid gap-4">
          {data.map(row => (
            <div key={row.id} className="bg-white rounded-xl shadow overflow-hidden flex" style={{ borderLeft: `4px solid ${row.aktif ? "#dc2626" : "#d1d5db"}` }}>
              {/* Thumbnail area */}
              <div style={{ width:200, minHeight:120, background:"#111", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                <img
                  src={`https://img.youtube.com/vi/${(row.embedUrl || row.youtubeUrl).match(/embed\/([^?]+)/)?.[1] || ""}/mqdefault.jpg`}
                  alt={row.judul}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={e => { e.target.style.display="none"; e.target.parentElement.innerHTML = '<div style="color:white;font-size:32px">▶</div>'; }}
                />
              </div>
              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ background: row.aktif ? "#fee2e2" : "#f3f4f6", color: row.aktif ? "#dc2626" : "#6b7280", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                      {row.aktif ? "🔴 AKTIF" : "Nonaktif"}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{row.judul}</h3>
                  {row.deskripsi && <p className="text-sm text-gray-500 mb-1">{row.deskripsi}</p>}
                  <p className="text-xs text-gray-400 truncate">{row.youtubeUrl}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={row.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline border border-blue-200 px-3 py-1 rounded-lg">Buka YouTube ↗</a>
                  <button onClick={() => openEdit(row)} className="text-xs text-teal-600 hover:text-teal-800 font-semibold border border-teal-200 px-3 py-1 rounded-lg hover:bg-teal-50">Edit</button>
                  <button onClick={() => setDelId(row.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"white", borderRadius:16, padding:32, width:"100%", maxWidth:580, maxHeight:"90vh", overflowY:"auto" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{edit ? "Edit Live Streaming" : "Tambah Live Streaming"}</h2>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Judul *</label>
              <input className={inp} value={form.judul} onChange={e => setForm(f => ({...f, judul: e.target.value}))} placeholder="cth: Ibadah Minggu 18 Mei 2025" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">URL YouTube *</label>
              <input className={inp} value={form.youtubeUrl} onChange={e => setForm(f => ({...f, youtubeUrl: e.target.value}))} placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..." />
              <p className="text-xs text-gray-400 mt-1">Tempel URL YouTube biasa — sistem akan otomatis konversi ke embed.</p>
            </div>
            {/* Live preview */}
            {embedPreview && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Preview</label>
                <div style={{ position:"relative", paddingBottom:"56.25%", borderRadius:8, overflow:"hidden", background:"#000" }}>
                  <iframe
                    src={embedPreview}
                    style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="preview"
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Deskripsi</label>
              <input className={inp} value={form.deskripsi} onChange={e => setForm(f => ({...f, deskripsi: e.target.value}))} placeholder="Keterangan singkat (opsional)" />
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
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Live Streaming?</h3>
            <p className="text-gray-500 text-sm mb-6">Data ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm font-semibold text-gray-600">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
