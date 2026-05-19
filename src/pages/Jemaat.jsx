import { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  nomorJemaat: "",
  namaLengkap: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "LAKI_LAKI",
  statusPernikahan: "BELUM_MENIKAH",
  pekerjaan: "",
  pendidikan: "",
  nomorTelepon: "",
  statusJemaat: "AKTIF",
  kkId: "",
};

const Jemaat = () => {
  const [jemaat, setJemaat] = useState([]);
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
  const fetchJemaat = async () => {
    try {
      setLoading(true);

      const res = await api.get("/jemaat", {
        params: { page, search },
      });

      const result = res.data.data;

      setJemaat(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setLimit(result.pagination?.limit || 10);

    } catch (error) {
      console.error("Gagal ambil data jemaat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJemaat();
  }, [page, search]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= TAMBAH / EDIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        kkId: Number(form.kkId),
      };

      if (isEdit) {
        await api.put(`/jemaat/${selectedId}`, payload);
      } else {
        await api.post("/jemaat", payload);
      }

      closeModal();
      fetchJemaat();

    } catch (error) {
      console.error("Gagal simpan jemaat:", error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);

    setForm({
      nomorJemaat: item.nomorJemaat || "",
      namaLengkap: item.namaLengkap || "",
      tempatLahir: item.tempatLahir || "",
      tanggalLahir: item.tanggalLahir?.split("T")[0] || "",
      jenisKelamin: item.jenisKelamin || "LAKI_LAKI",
      statusPernikahan: item.statusPernikahan || "BELUM_MENIKAH",
      pekerjaan: item.pekerjaan || "",
      pendidikan: item.pendidikan || "",
      nomorTelepon: item.nomorTelepon || "",
      statusJemaat: item.statusJemaat || "AKTIF",
      kkId: item.kkId || "",
    });

    setShowModal(true);
  };

  // ================= HAPUS =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus data ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/jemaat/${id}`);
      fetchJemaat();
    } catch (error) {
      console.error("Gagal hapus jemaat:", error);
    }
  };

  // ================= CLOSE MODAL =================
  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setSelectedId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Jemaat</h1>

      {/* Search + Button */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Cari jemaat..."
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
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">JK</th>
              <th className="p-3">Telepon</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : jemaat.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              jemaat.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-3">{item.namaLengkap}</td>
                  <td className="p-3">{item.jenisKelamin}</td>
                  <td className="p-3">{item.nomorTelepon}</td>
                  <td className="p-3">{item.statusJemaat}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Jemaat" : "Tambah Jemaat"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="nomorJemaat" placeholder="Nomor Jemaat" value={form.nomorJemaat} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <input name="namaLengkap" placeholder="Nama Lengkap" value={form.namaLengkap} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <input name="tempatLahir" placeholder="Tempat Lahir" value={form.tempatLahir} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <select name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>

              <select name="statusPernikahan" value={form.statusPernikahan} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="BELUM_MENIKAH">Belum Menikah</option>
                <option value="MENIKAH">Menikah</option>
              </select>

              <input name="pekerjaan" placeholder="Pekerjaan" value={form.pekerjaan} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="pendidikan" placeholder="Pendidikan" value={form.pendidikan} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="nomorTelepon" placeholder="Nomor Telepon" value={form.nomorTelepon} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <select name="statusJemaat" value={form.statusJemaat} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="AKTIF">Aktif</option>
                <option value="TIDAK_AKTIF">Tidak Aktif</option>
              </select>

              <input name="kkId" placeholder="ID KK" value={form.kkId} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">
                  Batal
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jemaat;