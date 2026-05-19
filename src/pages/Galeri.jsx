// src/pages/Galeri.jsx
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

const EMPTY = { judul: "", deskripsi: "", imageUrl: "", urutan: 0, aktif: true };

export default function GaleriAdmin() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [edit, setEdit]         = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [inputMode, setInputMode] = useState("upload"); // "upload" | "url"
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState("");
  const [delId, setDelId]       = useState(null);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/galeri");
      setData(res.data.data || []);
    } catch { setData([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd = () => {
    setEdit(null);
    setForm(EMPTY);
    setFotoFile(null);
    setPreviewUrl("");
    setInputMode("upload");
    setModal(true);
  };

  const openEdit = (row) => {
    setEdit(row);
    setForm({ judul: row.judul, deskripsi: row.deskripsi || "", imageUrl: row.imageUrl, urutan: row.urutan, aktif: row.aktif });
    setFotoFile(null);
    setPreviewUrl(row.imageUrl);
    // Tentukan mode berdasarkan URL lama
    setInputMode(row.imageUrl?.includes('/uploads/galeri/') ? "upload" : "url");
    setModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("❌ Hanya file gambar!"); return; }
    setFotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.judul) { showToast("❌ Judul wajib diisi!"); return; }

    // Validasi gambar
    if (inputMode === "upload" && !fotoFile && !edit) {
      showToast("❌ Pilih foto terlebih dahulu!"); return;
    }
    if (inputMode === "url" && !form.imageUrl) {
      showToast("❌ URL gambar wajib diisi!"); return;
    }

    setSaving(true);
    try {
      // Gunakan FormData agar bisa kirim file
      const fd = new FormData();
      fd.append("judul", form.judul);
      fd.append("deskripsi", form.deskripsi || "");
      fd.append("urutan", form.urutan);
      fd.append("aktif", form.aktif);

      if (inputMode === "upload" && fotoFile) {
        fd.append("foto", fotoFile); // field name "foto" sesuai backend
      } else {
        fd.append("imageUrl", form.imageUrl);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (edit) {
        await api.put(`/galeri/${edit.id}`, fd, config);
        showToast("✅ Foto berhasil diperbarui!");
      } else {
        await api.post("/galeri", fd, config);
        showToast("✅ Foto berhasil ditambahkan!");
      }
      setModal(false);
      load();
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Gagal menyimpan"));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/galeri/${delId}`);
      showToast("✅ Foto berhasil dihapus!");
      setDelId(null); load();
    } catch { showToast("❌ Gagal menghapus."); setDelId(null); }
  };

  const inp = "border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-teal-500";

  return (
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:24, zIndex:9999, background:"#005461", color:"white", padding:"12px 20px", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", fontSize:14 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galeri Foto</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola foto galeri yang tampil di landing page</p>
        </div>
        <button onClick={openAdd} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Tambah Foto
        </button>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Belum ada foto. Tambahkan foto pertama!</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Foto</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Judul</th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">Deskripsi</th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold">Urutan</th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-gray-600 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={row.imageUrl} alt={row.judul}
                      style={{ width:72, height:54, objectFit:"cover", borderRadius:6, background:"#e5e7eb" }}
                      onError={e => { e.target.style.background="#f3f4f6"; e.target.style.display="none"; }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.judul}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{row.deskripsi || "-"}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{row.urutan}</td>
                  <td className="px-4 py-3 text-center">
                    <span style={{ background: row.aktif ? "#d1fae5":"#fee2e2", color: row.aktif ? "#065f46":"#991b1b", padding:"2px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                      {row.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openEdit(row)} className="text-teal-600 hover:text-teal-800 font-semibold mr-3">Edit</button>
                    <button onClick={() => setDelId(row.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL TAMBAH / EDIT ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"white", borderRadius:16, padding:32, width:"100%", maxWidth:560, maxHeight:"92vh", overflowY:"auto" }}>
            <h2 className="text-xl font-bold text-gray-800 mb-5">{edit ? "Edit Foto" : "Tambah Foto Baru"}</h2>

            {/* Judul */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Judul Foto *</label>
              <input className={inp} value={form.judul} onChange={e => setForm(f => ({...f, judul: e.target.value}))} placeholder="cth: Ibadah Minggu, Pemuda 2025" />
            </div>

            {/* Tab pilih mode input gambar */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Sumber Gambar *</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => { setInputMode("upload"); setPreviewUrl(fotoFile ? URL.createObjectURL(fotoFile) : ""); }}
                  className={`flex-1 py-2 text-sm font-semibold transition ${inputMode === "upload" ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  📁 Upload dari PC
                </button>
                <button
                  onClick={() => { setInputMode("url"); setPreviewUrl(form.imageUrl || ""); }}
                  className={`flex-1 py-2 text-sm font-semibold transition ${inputMode === "url" ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  🔗 Pakai URL Link
                </button>
              </div>
            </div>

            {/* Input sesuai mode */}
            {inputMode === "upload" ? (
              <div className="mb-4">
                {/* Area drag & drop */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: "2px dashed #249e94", borderRadius:10, padding:"24px 16px",
                    textAlign:"center", cursor:"pointer", background:"#f0faf9",
                    transition:"background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#e0f5f1"}
                  onMouseLeave={e => e.currentTarget.style.background="#f0faf9"}
                >
                  {previewUrl && inputMode === "upload" ? (
                    <img src={previewUrl} alt="preview" style={{ maxHeight:160, maxWidth:"100%", objectFit:"contain", borderRadius:8, margin:"0 auto" }} />
                  ) : (
                    <>
                      <div style={{ fontSize:40, marginBottom:8 }}>📷</div>
                      <p style={{ color:"#249e94", fontWeight:600, fontSize:14 }}>Klik untuk pilih foto</p>
                      <p style={{ color:"#8aacaa", fontSize:12, marginTop:4 }}>atau drag & drop di sini</p>
                      <p style={{ color:"#aaa", fontSize:11, marginTop:8 }}>JPG, PNG, WEBP, GIF — maks 5MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange} />
                {fotoFile && (
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <span>📎 {fotoFile.name}</span>
                    <button onClick={() => { setFotoFile(null); setPreviewUrl(edit ? edit.imageUrl : ""); fileRef.current.value=""; }} className="text-red-400 hover:text-red-600 font-semibold ml-2">✕</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <input className={inp} value={form.imageUrl}
                  onChange={e => { setForm(f => ({...f, imageUrl: e.target.value})); setPreviewUrl(e.target.value); }}
                  placeholder="https://..." />
                {previewUrl && inputMode === "url" && (
                  <div className="mt-2">
                    <img src={previewUrl} alt="preview" style={{ width:"100%", height:140, objectFit:"cover", borderRadius:8, background:"#f3f4f6" }}
                      onError={e => e.target.style.display="none"} />
                  </div>
                )}
              </div>
            )}

            {/* Deskripsi */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Deskripsi</label>
              <input className={inp} value={form.deskripsi} onChange={e => setForm(f => ({...f, deskripsi: e.target.value}))} placeholder="Keterangan singkat (opsional)" />
            </div>

            {/* Urutan & Status */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Urutan</label>
                <input type="number" className={inp} value={form.urutan} min={0}
                  onChange={e => setForm(f => ({...f, urutan: Number(e.target.value)}))} />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Status</label>
                <select className={inp} value={form.aktif ? "1" : "0"} onChange={e => setForm(f => ({...f, aktif: e.target.value === "1"}))}>
                  <option value="1">Aktif (tampil)</option>
                  <option value="0">Nonaktif</option>
                </select>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? "Menyimpan..." : (edit ? "Simpan Perubahan" : "Tambah Foto")}
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Foto?</h3>
            <p className="text-gray-500 text-sm mb-6">Foto ini akan dihapus permanen dari galeri.</p>
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
