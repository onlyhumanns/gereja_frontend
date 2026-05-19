import { useState } from "react";
import api from "../api/axios";

const Laporan = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    statusJemaat: "",
    jenisKelamin: "",
    statusPernikahan: "",
    pendidikan: "",
    tanggalLahirDari: "",
    tanggalLahirSampai: "",
  });

  // ================= FETCH =================
  const fetchLaporan = async () => {
    try {
      setLoading(true);

      const res = await api.get("/laporan/jemaat", {
        params: filter,
      });

      const result = res.data.data;

      setData(result.data || []);
      setTotal(result.total || 0);

    } catch (error) {
      console.error("Gagal ambil laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE =================
  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    fetchLaporan();
  };

  const resetFilter = () => {
    setFilter({
      statusJemaat: "",
      jenisKelamin: "",
      statusPernikahan: "",
      pendidikan: "",
      tanggalLahirDari: "",
      tanggalLahirSampai: "",
    });
    setData([]);
    setTotal(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Laporan Jemaat</h1>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <select name="statusJemaat" value={filter.statusJemaat} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="">Status Jemaat</option>
          <option value="AKTIF">Aktif</option>
          <option value="TIDAK_AKTIF">Tidak Aktif</option>
        </select>

        <select name="jenisKelamin" value={filter.jenisKelamin} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="">Jenis Kelamin</option>
          <option value="LAKI_LAKI">Laki-laki</option>
          <option value="PEREMPUAN">Perempuan</option>
        </select>

        <select name="statusPernikahan" value={filter.statusPernikahan} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="">Status Pernikahan</option>
          <option value="MENIKAH">Menikah</option>
          <option value="BELUM_MENIKAH">Belum Menikah</option>
        </select>

        <select name="pendidikan" value={filter.pendidikan} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="">Pendidikan</option>
          <option value="SMA">SMA</option>
          <option value="D3">D3</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
        </select>

        <input type="date" name="tanggalLahirDari" value={filter.tanggalLahirDari} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input type="date" name="tanggalLahirSampai" value={filter.tanggalLahirSampai} onChange={handleChange} className="border px-3 py-2 rounded" />

        <div className="flex gap-2 col-span-1 md:col-span-3">
          <button onClick={handleFilter} className="bg-blue-600 text-white px-4 py-2 rounded">
            Tampilkan
          </button>

          <button onClick={resetFilter} className="bg-gray-300 px-4 py-2 rounded">
            Reset
          </button>
        </div>

      </div>

      {/* TOTAL */}
      <div className="mb-4 font-semibold">
        Total Data: {total}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">JK</th>
              <th className="p-3">Status</th>
              <th className="p-3">Pendidikan</th>
              <th className="p-3">Telepon</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">Belum ada data</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.namaLengkap}</td>
                  <td className="p-3">{item.jenisKelamin}</td>
                  <td className="p-3">{item.statusJemaat}</td>
                  <td className="p-3">{item.pendidikan}</td>
                  <td className="p-3">{item.nomorTelepon}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Laporan;