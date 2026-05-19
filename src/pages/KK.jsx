import { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  nomorKK: "",
  alamat: "",
  rt: "",
  rw: "",
  kelurahan: "",
  kecamatan: "",
  kota: "",
};

const KK = () => {
  const [kk, setKk] = useState([]);
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
  const fetchKK = async () => {
    try {
      setLoading(true);

      const res = await api.get("/kk", {
        params: { page, search },
      });

      const result = res.data.data;

      setKk(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setLimit(result.pagination?.limit || 10);

    } catch (error) {
      console.error("Gagal ambil data KK:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKK();
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
        await api.put(`/kk/${selectedId}`, form);
      } else {
        await api.post("/kk", form);
      }

      closeModal();
      fetchKK();

    } catch (error) {
      console.error("Gagal simpan KK:", error);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);

    setForm({
      nomorKK: item.nomorKK || "",
      alamat: item.alamat || "",
      rt: item.rt || "",
      rw: item.rw || "",
      kelurahan: item.kelurahan || "",
      kecamatan: item.kecamatan || "",
      kota: item.kota || "",
    });

    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus KK ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/kk/${id}`);
      fetchKK();
    } catch (error) {
      console.error("Gagal hapus KK:", error);
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
      <h1 className="text-2xl font-bold mb-6">Data Kartu Keluarga</h1>

      {/* Search + Button */}
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Cari KK..."
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
              <th className="p-3">Nomor KK</th>
              <th className="p-3">Alamat</th>
              <th className="p-3">Wilayah</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : kk.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              kk.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-3">{item.nomorKK}</td>
                  <td className="p-3">{item.alamat}</td>
                  <td className="p-3">
                    {item.kelurahan}, {item.kecamatan}, {item.kota}
                  </td>
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
              {isEdit ? "Edit KK" : "Tambah KK"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="nomorKK" placeholder="Nomor KK" value={form.nomorKK} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
              <textarea name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <input name="rt" placeholder="RT" value={form.rt} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="rw" placeholder="RW" value={form.rw} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

              <input name="kelurahan" placeholder="Kelurahan" value={form.kelurahan} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="kecamatan" placeholder="Kecamatan" value={form.kecamatan} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input name="kota" placeholder="Kota" value={form.kota} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

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

export default KK;