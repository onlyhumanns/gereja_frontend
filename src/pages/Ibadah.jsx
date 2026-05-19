import { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  namaIbadah: "",
  tanggal: "",
  waktuMulai: "",
  waktuSelesai: "",
  lokasi: "",
  tema: "",
  pengkhotbah: "",
  liturgos: "",
  pemainMusik: "",
  keterangan: "",
  status: "TERJADWAL",
};

const Ibadah = () => {
  const [ibadah, setIbadah] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState(initialForm);

  // ================= FETCH =================
  const fetchIbadah = async () => {
    try {
      setLoading(true);

      const res = await api.get("/ibadah", {
        params: { page, search },
      });

      const result = res.data.data;

      setIbadah(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setLimit(result.pagination?.limit || 10);

    } catch (error) {
      console.error("Gagal ambil data ibadah:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIbadah();
  }, [page, search]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/ibadah/${selectedId}`, form);
      } else {
        await api.post("/ibadah", form);
      }

      closeModal();
      fetchIbadah();

    } catch (error) {
      console.error("Gagal simpan ibadah:", error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);

    setForm({
      namaIbadah: item.namaIbadah || "",
      tanggal: item.tanggal?.split("T")[0] || "",
      waktuMulai: item.waktuMulai || "",
      waktuSelesai: item.waktuSelesai || "",
      lokasi: item.lokasi || "",
      tema: item.tema || "",
      pengkhotbah: item.pengkhotbah || "",
      liturgos: item.liturgos || "",
      pemainMusik: item.pemainMusik || "",
      keterangan: item.keterangan || "",
      status: item.status || "TERJADWAL",
    });

    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus jadwal ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/ibadah/${id}`);
      fetchIbadah();
    } catch (error) {
      console.error("Gagal hapus ibadah:", error);
    }
  };

  // ================= CLOSE =================
  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setSelectedId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jadwal Ibadah</h1>

      {/* Search + Button */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Cari ibadah..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-4 py-2 rounded-lg w-64"
        />

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Tambah
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Waktu</th>
              <th className="p-3">Pengkhotbah</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4">Loading...</td>
              </tr>
            ) : ibadah.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">Data tidak ditemukan</td>
              </tr>
            ) : (
              ibadah.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{(page - 1) * limit + index + 1}</td>
                  <td className="p-3">{item.namaIbadah}</td>
                  <td className="p-3">{item.tanggal?.split("T")[0]}</td>
                  <td className="p-3">{item.waktuMulai} - {item.waktuSelesai}</td>
                  <td className="p-3">{item.pengkhotbah}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(item)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
        <span className="px-3 py-1">{page} / {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded">Next</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Ibadah" : "Tambah Ibadah"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="namaIbadah" placeholder="Nama Ibadah" value={form.namaIbadah} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <div className="flex gap-2">
                <input type="time" name="waktuMulai" value={form.waktuMulai} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                <input type="time" name="waktuSelesai" value={form.waktuSelesai} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>

              <input name="lokasi" placeholder="Lokasi" value={form.lokasi} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="tema" placeholder="Tema" value={form.tema} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="pengkhotbah" placeholder="Pengkhotbah" value={form.pengkhotbah} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="liturgos" placeholder="Liturgos" value={form.liturgos} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="pemainMusik" placeholder="Pemain Musik" value={form.pemainMusik} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <textarea name="keterangan" placeholder="Keterangan" value={form.keterangan} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="TERJADWAL">Terjadwal</option>
                <option value="SELESAI">Selesai</option>
                <option value="BATAL">Batal</option>
              </select>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Batal</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ibadah;