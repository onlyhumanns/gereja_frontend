// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const STATUS_COLOR = {
  Pending:  "bg-yellow-100 text-yellow-700",
  Diproses: "bg-blue-100 text-blue-700",
  Selesai:  "bg-green-100 text-green-700",
  Ditolak:  "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data.data))
      .catch(err => console.error("Gagal ambil dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Memuat dashboard...</p>;
  if (!data)   return <p className="text-red-500">Gagal memuat data.</p>;

  const { ringkasan, dataTerbaru } = data;

  const cards = [
    { label: "Total Pengajuan", value: ringkasan.totalPengajuan, color: "text-blue-600",   bg: "border-blue-200" },
    { label: "Pending",         value: ringkasan.totalPending,   color: "text-yellow-600", bg: "border-yellow-200" },
    { label: "Diproses",        value: ringkasan.totalDiproses,  color: "text-indigo-600", bg: "border-indigo-200" },
    { label: "Selesai",         value: ringkasan.totalSelesai,   color: "text-green-600",  bg: "border-green-200" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className={`bg-white shadow rounded-2xl p-5 border-l-4 ${c.bg}`}>
            <p className="text-gray-500 text-sm mb-1">{c.label}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Pengajuan Terbaru</h2>
          <Link to="/terhubung" className="text-sm text-blue-600 hover:underline">
            Lihat Semua →
          </Link>
        </div>

        {dataTerbaru.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada pengajuan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">Nama</th>
                  <th className="pb-2 pr-4">Pelayanan</th>
                  <th className="pb-2 pr-4">Nomor HP</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dataTerbaru.map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{item.namaLengkap}</td>
                    <td className="py-2 pr-4 text-gray-600">{item.jenisPelayanan}</td>
                    <td className="py-2 pr-4 text-gray-600">{item.nomorHp}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[item.status] || "bg-gray-100 text-gray-600"}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;