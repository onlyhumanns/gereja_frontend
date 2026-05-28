import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

// ─── Warna tema ───────────────────────────────────────────
const C = {
  dark:   "#005461",
  mid:    "#0c7779",
  accent: "#249e94",
  light:  "#3bc1a8",
};

// ─── Data statis (bisa diganti dari backend nanti) ────────
const VISI = "Menjadi gereja yang memuliakan Tuhan, membangun jemaat yang dewasa rohani, dan menjangkau jiwa-jiwa bagi Kerajaan Allah.";
const MISI = [
  "Mewujudkan ibadah yang penuh Roh Kudus dan kebenaran Firman Tuhan.",
  "Membangun jemaat yang bertumbuh dalam iman, karakter, dan pelayanan.",
  "Menjangkau masyarakat Manado dan sekitarnya dengan Injil Kristus.",
  "Memberdayakan keluarga-keluarga sebagai fondasi jemaat yang kuat.",
];
const SEJARAH = `GBI Keluarga Allah Manado berdiri atas kerinduan untuk membawa terang Injil di kota Manado dan sekitarnya. Dimulai dari sebuah persekutuan kecil yang penuh semangat, gereja ini terus bertumbuh menjadi keluarga besar yang saling mengasihi dan melayani. Hingga hari ini, GBI Keluarga Allah Manado terus berkomitmen untuk menjadi berkat bagi kota dan bangsa.`;
// Galeri, Pengumuman, LiveStreaming akan diambil dari API


const JENIS_PELAYANAN = [
  "Ingin Berjemaat",
  "Pemberkatan Nikah",
  "Penyerahan Anak",
  "Baptisan",
  "Konseling",
  "Permohonan Doa",
];

export default function Home() {
  const [jadwal, setJadwal]           = useState([]);
  const [galeri, setGaleri]           = useState([]);
  const [pengumuman, setPengumuman]   = useState([]);
  const [liveStream, setLiveStream]   = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const heroRef = useRef(null);

  // Form terhubung
  const [form, setForm] = useState({ namaLengkap: "", nomorHp: "", alamat: "", email: "", jenisPelayanan: "", keterangan: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormError("");
    if (!form.namaLengkap || !form.nomorHp || !form.alamat || !form.jenisPelayanan) {
      setFormError("Nama lengkap, nomor HP, alamat, dan jenis pelayanan wajib diisi.");
      return;
    }
    setFormLoading(true);
    try {
      await api.post("/terhubung", form);
      setFormSuccess(true);
      setForm({ namaLengkap: "", nomorHp: "", alamat: "", email: "", jenisPelayanan: "", keterangan: "" });
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal mengirim pengajuan. Coba lagi.");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    // Ambil jadwal ibadah dari backend
    api.get("/ibadah", { params: { limit: 4 } })
      .then(res => setJadwal(res.data?.data?.data || []))
      .catch(() => setJadwal([]));

    // Ambil galeri foto
    api.get("/galeri/publik")
      .then(res => setGaleri(res.data?.data || []))
      .catch(() => setGaleri([]));

    // Ambil pengumuman terbaru
    api.get("/pengumuman/publik", { params: { limit: 5 } })
      .then(res => setPengumuman(res.data?.data || []))
      .catch(() => setPengumuman([]));

    // Ambil live streaming aktif
    api.get("/livestreaming/publik")
      .then(res => setLiveStream(res.data?.data?.[0] || null))
      .catch(() => setLiveStream(null));

    // Navbar scroll effect
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f8faf9", color: "#1a2e2b" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Lato:wght@300;400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Lato', sans-serif; }

        .heading { font-family: 'Playfair Display', serif; }

        /* Navbar */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.4s ease;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar.scrolled {
          background: ${C.dark};
          padding: 12px 40px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a {
          color: white; text-decoration: none; font-family: 'Lato', sans-serif;
          font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase;
          opacity: 0.85; transition: opacity 0.2s;
        }
        .nav-links a:hover { opacity: 1; }

        /* Hero */
        .hero {
          min-height: 100vh;
          background: linear-gradient(160deg, ${C.dark} 0%, ${C.mid} 50%, ${C.accent} 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 40px;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-cross {
          font-size: 72px; margin-bottom: 24px;
          animation: fadeDown 1s ease forwards;
          opacity: 0;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 6vw, 5rem);
          font-weight: 900; color: white;
          line-height: 1.1; margin-bottom: 12px;
          animation: fadeDown 1s ease 0.2s forwards; opacity: 0;
        }
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.8);
          font-family: 'Lato', sans-serif; font-weight: 300;
          letter-spacing: 3px; text-transform: uppercase;
          margin-bottom: 20px;
          animation: fadeDown 1s ease 0.4s forwards; opacity: 0;
        }
        .hero-verse {
          font-style: italic; color: rgba(255,255,255,0.7);
          font-size: 1rem; max-width: 500px;
          animation: fadeDown 1s ease 0.6s forwards; opacity: 0;
          margin-bottom: 40px;
        }
        .hero-btn {
          background: white; color: ${C.dark};
          border: none; padding: 14px 40px;
          font-family: 'Lato', sans-serif; font-weight: 700;
          font-size: 14px; letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeDown 1s ease 0.8s forwards; opacity: 0;
        }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* Section */
        .section { padding: 90px 40px; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-family: 'Lato', sans-serif; font-size: 12px;
          letter-spacing: 4px; text-transform: uppercase;
          color: ${C.accent}; margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          color: ${C.dark}; margin-bottom: 32px;
          line-height: 1.2;
        }
        .divider {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, ${C.accent}, ${C.light});
          margin-bottom: 40px; border-radius: 2px;
        }

        /* Tentang / Sejarah */
        .tentang-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px; align-items: center;
        }
        .tentang-text { font-size: 1.05rem; line-height: 1.9; color: #3a5450; }
        .tentang-visual {
          background: linear-gradient(135deg, ${C.dark}, ${C.accent});
          border-radius: 4px; padding: 60px 40px; text-align: center;
          color: white;
        }
        .tentang-visual .big { font-size: 80px; }
        .tentang-visual p { font-family: 'Lato', sans-serif; opacity: 0.85; margin-top: 12px; }

        /* Visi Misi */
        .visimisi-wrap { background: ${C.dark}; padding: 90px 40px; }
        .visimisi-inner { max-width: 1100px; margin: 0 auto; }
        .visimisi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 48px; }
        .visi-box {
          background: rgba(255,255,255,0.06); border-left: 3px solid ${C.light};
          padding: 32px; border-radius: 2px;
        }
        .visi-box h3 {
          font-family: 'Playfair Display', serif; font-size: 1.5rem;
          color: ${C.light}; margin-bottom: 16px;
        }
        .visi-box p, .visi-box li {
          color: rgba(255,255,255,0.8); line-height: 1.8; font-size: 0.95rem;
        }
        .visi-box ul { padding-left: 20px; }
        .visi-box li { margin-bottom: 10px; }

        /* Jadwal Ibadah */
        .jadwal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
        .jadwal-card {
          background: white; border-radius: 4px;
          border-top: 4px solid ${C.accent};
          padding: 28px; box-shadow: 0 4px 20px rgba(0,84,97,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .jadwal-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,84,97,0.15); }
        .jadwal-card .nama { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: ${C.dark}; margin-bottom: 8px; }
        .jadwal-card .info { font-size: 0.85rem; color: #6b9090; margin-bottom: 4px; }
        .jadwal-badge {
          display: inline-block; margin-top: 12px;
          background: ${C.light}22; color: ${C.mid};
          font-size: 11px; padding: 3px 10px; border-radius: 20px;
          font-family: 'Lato', sans-serif; letter-spacing: 1px; text-transform: uppercase;
        }
        .jadwal-empty {
          grid-column: 1/-1; text-align: center;
          padding: 60px; color: #8aacaa; font-style: italic;
        }

        /* Pengumuman */
        .pengumuman-wrap { background: linear-gradient(180deg, #f0faf8 0%, #f8faf9 100%); padding: 90px 40px; }
        .pengumuman-inner { max-width: 1100px; margin: 0 auto; }
        .pengumuman-list { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
        .pengumuman-card {
          background: white; border-radius: 4px; padding: 28px 32px;
          display: grid; grid-template-columns: 140px 1fr;
          gap: 24px; box-shadow: 0 2px 16px rgba(0,84,97,0.06);
          border-left: 3px solid ${C.accent};
        }
        .pengumuman-tanggal { font-size: 0.8rem; color: ${C.accent}; font-weight: 700; letter-spacing: 0.5px; padding-top: 4px; }
        .pengumuman-judul { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: ${C.dark}; margin-bottom: 8px; }
        .pengumuman-isi { font-size: 0.9rem; color: #5a7a78; line-height: 1.7; }

        /* Galeri */
        .galeri-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 40px; }
        .galeri-item {
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, ${C.dark}, ${C.mid});
          border-radius: 4px; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: white; cursor: pointer;
          transition: transform 0.3s, filter 0.3s;
          overflow: hidden; position: relative;
        }
        .galeri-item:hover { transform: scale(1.02); filter: brightness(1.1); }
        .galeri-item:nth-child(2n) { background: linear-gradient(135deg, ${C.mid}, ${C.accent}); }
        .galeri-item:nth-child(3n) { background: linear-gradient(135deg, ${C.accent}, ${C.light}); }
        .galeri-emoji { font-size: 48px; margin-bottom: 12px; }
        .galeri-label { font-family: 'Lato', sans-serif; font-size: 13px; letter-spacing: 1px; opacity: 0.9; }

        /* Terhubung */
        .terhubung-wrap { background: linear-gradient(135deg, #f0faf8 0%, #e8f5f2 100%); padding: 90px 40px; }
        .terhubung-inner { max-width: 700px; margin: 0 auto; }
        .terhubung-form { background: white; border-radius: 20px; padding: 48px; box-shadow: 0 8px 40px rgba(0,84,97,0.1); margin-top: 40px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .form-group label { font-size: 0.85rem; font-weight: 700; color: #005461; letter-spacing: 0.5px; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea { border: 1.5px solid #d0e8e4; border-radius: 10px; padding: 12px 16px; font-size: 0.95rem; color: #1a2e2b; transition: border-color 0.2s; outline: none; font-family: inherit; background: #f8faf9; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #249e94; background: white; }
        .form-group textarea { resize: vertical; min-height: 90px; }
        .form-submit { width: 100%; padding: 14px; border: none; border-radius: 12px; cursor: pointer; background: linear-gradient(135deg, #005461, #0c7779); color: white; font-size: 1rem; font-weight: 700; letter-spacing: 1px; transition: opacity 0.2s; }
        .form-submit:hover { opacity: 0.9; }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-success { text-align: center; padding: 32px; }
        .form-success .check { font-size: 56px; margin-bottom: 16px; }
        .form-success h3 { font-family: inherit; font-size: 1.5rem; color: #005461; margin-bottom: 8px; }
        .form-success p { color: #6b9090; }
        .form-error { background: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; padding: 12px 16px; color: #c0392b; font-size: 0.9rem; margin-bottom: 16px; }

        /* Kontak */
        .kontak-wrap { background: ${C.dark}; padding: 90px 40px; }
        .kontak-inner { max-width: 1100px; margin: 0 auto; }
        .kontak-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 48px; align-items: start; }
        .kontak-info { color: rgba(255,255,255,0.85); }
        .kontak-item { display: flex; gap: 16px; margin-bottom: 28px; align-items: flex-start; }
        .kontak-icon { font-size: 24px; margin-top: 2px; }
        .kontak-detail h4 { color: ${C.light}; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
        .kontak-detail p { font-size: 0.9rem; line-height: 1.6; }
        .wa-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #25D366; color: white;
          padding: 14px 28px; border-radius: 2px;
          text-decoration: none; font-family: 'Lato', sans-serif;
          font-weight: 700; font-size: 14px; letter-spacing: 1px;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 8px;
        }
        .wa-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,211,102,0.3); }
        .map-placeholder {
          background: rgba(255,255,255,0.06); border-radius: 4px;
          height: 280px; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.4); font-style: italic; font-size: 0.9rem;
          border: 1px dashed rgba(255,255,255,0.15);
        }

        /* Live Streaming */
        .live-wrap { background: #0a1628; padding: 90px 40px; }
        .live-inner { max-width: 900px; margin: 0 auto; }
        .live-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #dc2626; color: white; padding: 6px 16px;
          border-radius: 20px; font-size: 12px; font-weight: 700;
          letter-spacing: 1px; margin-bottom: 20px; animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.7; }
        }
        .live-player {
          position: relative; padding-bottom: 56.25%;
          border-radius: 8px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          margin-top: 24px;
        }
        .live-player iframe {
          position: absolute; inset: 0; width: 100%; height: 100%; border: none;
        }
        .live-desc {
          color: rgba(255,255,255,0.6); font-size: 0.9rem;
          margin-top: 16px; line-height: 1.6;
        }
        .live-empty {
          text-align: center; padding: 60px;
          color: rgba(255,255,255,0.3); font-style: italic;
          border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;
        }

        /* Galeri foto dari DB */
        .galeri-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .galeri-item:hover .galeri-img { transform: scale(1.05); }
        .galeri-overlay {
          position: absolute; inset: 0; background: rgba(0,84,97,0.55);
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; opacity: 0; transition: opacity 0.3s;
        }
        .galeri-item:hover .galeri-overlay { opacity: 1; }

        /* Footer */
        .footer {
          background: #001f27; padding: 32px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { color: rgba(255,255,255,0.4); font-size: 13px; }
        .footer-admin {
          color: rgba(255,255,255,0.2); font-size: 12px;
          text-decoration: none; transition: color 0.2s;
          letter-spacing: 0.5px;
        }
        .footer-admin:hover { color: rgba(255,255,255,0.5); }

        /* Hamburger mobile */
        .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; }
        .hamburger span { width: 24px; height: 2px; background: white; border-radius: 2px; }
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 99;
          background: ${C.dark}; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          color: white; text-decoration: none; font-size: 1.4rem;
          font-family: 'Playfair Display', serif;
        }

        /* Animasi */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .tentang-grid, .visimisi-grid, .kontak-grid { grid-template-columns: 1fr; }
          .galeri-grid { grid-template-columns: repeat(2, 1fr); }
          .pengumuman-card { grid-template-columns: 1fr; gap: 8px; }
          .navbar { padding: 16px 20px; }
          .section { padding: 60px 20px; }
          .footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="heading" style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>
          🕊️ GBI Keluarga Allah
        </div>
        <ul className="nav-links">
          {["tentang","visimisi","jadwal","pengumuman","galeri","livestreaming","terhubung","kontak"].map(id => (
            <li key={id}>
              <a href="#" onClick={e => { e.preventDefault(); scrollTo(id); }}>
                {id === "visimisi" ? "Visi & Misi" : id === "terhubung" ? "Terhubung" : id === "livestreaming" ? "Live" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position:"absolute", top:20, right:24, background:"none", border:"none", color:"white", fontSize:"28px", cursor:"pointer" }}>✕</button>
        {["tentang","visimisi","jadwal","pengumuman","galeri","livestreaming","terhubung","kontak"].map(id => (
          <a key={id} href="#" onClick={e => { e.preventDefault(); scrollTo(id); }}>
            {id === "visimisi" ? "Visi & Misi" : id === "terhubung" ? "Terhubung" : id === "livestreaming" ? "Live" : id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-cross">✝️</div>
        <h1 className="heading">GBI Keluarga Allah<br/>Manado</h1>
        <p className="hero-sub">Gereja Bethel Indonesia</p>
        <p className="hero-verse">"Karena begitu besar kasih Allah akan dunia ini..." — Yohanes 3:16</p>
        <button className="hero-btn" onClick={() => scrollTo("jadwal")}>
          Lihat Jadwal Ibadah
        </button>
      </section>

      {/* ── TENTANG ── */}
      <section id="tentang">
        <div className="tentang-visual">
  <img 
    src="https://jkfhgkdrmzehvcaozesa.supabase.co/storage/v1/object/public/galeri/galeri_1779769046159.jpeg" 
    alt="Tentang Gereja" 
    style={{ 
      width: "100%", 
      height: "350px", 
      objectFit: "cover", 
      borderRadius: "12px" 
    }} 
  />
  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", marginTop:16 }}>
    "Bertumbuh dalam Iman,<br/>Melayani dalam Kasih"
  </p>
</div>
      </section>

      {/* ── VISI & MISI ── */}
      <section id="visimisi" className="visimisi-wrap">
        <div className="visimisi-inner">
          <p className="section-label" style={{ color: C.light }}>Arah & Tujuan</p>
          <h2 className="section-title heading" style={{ color: "white" }}>Visi & Misi</h2>
          <div className="divider"/>
          <div className="visimisi-grid">
            <div className="visi-box">
              <h3>Visi</h3>
              <p>{VISI}</p>
            </div>
            <div className="visi-box">
              <h3>Misi</h3>
              <ul>
                {MISI.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── JADWAL IBADAH ── */}
      <section id="jadwal">
        <div className="section">
          <p className="section-label">Hadir Bersama Kami</p>
          <h2 className="section-title heading">Jadwal Ibadah</h2>
          <div className="divider"/>
          <div className="jadwal-grid">
            {jadwal.length === 0 ? (
              <div className="jadwal-empty">Belum ada jadwal ibadah tersedia.</div>
            ) : jadwal.map((j, i) => (
              <div className="jadwal-card" key={i}>
                <div className="nama">{j.namaIbadah}</div>
                <div className="info">📅 {new Date(j.tanggal).toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"long" })}</div>
                <div className="info">🕐 {j.waktuMulai} – {j.waktuSelesai} WITA</div>
                <div className="info">📍 {j.lokasi}</div>
                {j.tema && <div className="info">📖 {j.tema}</div>}
                {j.pengkhotbah && <div className="info">🎤 {j.pengkhotbah}</div>}
                <span className="jadwal-badge">{j.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PENGUMUMAN (dari DB) ── */}
      <section id="pengumuman" className="pengumuman-wrap">
        <div className="pengumuman-inner">
          <p className="section-label">Informasi Terkini</p>
          <h2 className="section-title heading">Pengumuman</h2>
          <div className="divider"/>
          <div className="pengumuman-list">
            {pengumuman.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px", color:"#8aacaa", fontStyle:"italic" }}>
                Belum ada pengumuman saat ini.
              </div>
            ) : pengumuman.map((p, i) => (
              <div className="pengumuman-card" key={i}>
                <div className="pengumuman-tanggal">
                  {new Date(p.tanggal).toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                </div>
                <div>
                  <div className="pengumuman-judul">{p.judul}</div>
                  <div className="pengumuman-isi">{p.isi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERI (dari DB) ── */}
      <section id="galeri">
        <div className="section">
          <p className="section-label">Momen Kebersamaan</p>
          <h2 className="section-title heading">Galeri</h2>
          <div className="divider"/>
          {galeri.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px", color:"#8aacaa", fontStyle:"italic", border:"1px dashed #cde", borderRadius:8 }}>
              📷 Foto galeri akan ditampilkan di sini setelah admin mengunggahnya.
            </div>
          ) : (
            <div className="galeri-grid">
              {galeri.map((g, i) => (
                <div className="galeri-item" key={i}>
                  <img src={g.imageUrl} alt={g.judul} className="galeri-img" />
                  <div className="galeri-overlay">
                    <div style={{ fontSize:"1rem", fontWeight:700, color:"white", textAlign:"center", padding:"0 12px" }}>{g.judul}</div>
                    {g.deskripsi && <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.8)", marginTop:4, textAlign:"center", padding:"0 12px" }}>{g.deskripsi}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIVE STREAMING (dari DB) ── */}
      <section id="livestreaming" className="live-wrap">
        <div className="live-inner">
          <p className="section-label" style={{ color: C.light }}>Ibadah Online</p>
          <h2 className="section-title heading" style={{ color:"white" }}>Live Streaming</h2>
          <div className="divider"/>
          {liveStream ? (
            <div>
              <div className="live-badge">
                <span>🔴</span> LIVE
              </div>
              <h3 style={{ color:"white", fontFamily:"'Playfair Display', serif", fontSize:"1.4rem", marginBottom:8 }}>
                {liveStream.judul}
              </h3>
              {liveStream.deskripsi && <p className="live-desc">{liveStream.deskripsi}</p>}
              <div className="live-player">
                <iframe
                  src={liveStream.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={liveStream.judul}
                />
              </div>
            </div>
          ) : (
            <div className="live-empty">
              <div style={{ fontSize:48, marginBottom:12 }}>📺</div>
              <p>Tidak ada siaran langsung saat ini.</p>
              <p style={{ fontSize:"0.8rem", marginTop:8 }}>Pantau terus halaman ini untuk ibadah live streaming berikutnya.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── TERHUBUNG ── */}
      <section id="terhubung" className="terhubung-wrap">
        <div className="terhubung-inner">
          <p className="section-label">Bergabung Bersama Kami</p>
          <h2 className="section-title heading">Terhubung</h2>
          <div className="divider"/>
          <div className="terhubung-form">
            {formSuccess ? (
              <div className="form-success">
                <div className="check">✅</div>
                <h3 className="heading">Terima Kasih!</h3>
                <p>Pengajuan Anda telah kami terima. Kami akan segera menghubungi Anda.</p>
                <button onClick={() => setFormSuccess(false)} style={{ marginTop:24, padding:"10px 28px", borderRadius:10, border:"none", background:"#005461", color:"white", cursor:"pointer", fontWeight:700 }}>Kirim Lagi</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {formError && <div className="form-error">{formError}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Lengkap *</label>
                    <input name="namaLengkap" value={form.namaLengkap} onChange={handleFormChange} placeholder="Nama lengkap Anda" />
                  </div>
                  <div className="form-group">
                    <label>Nomor HP *</label>
                    <input name="nomorHp" value={form.nomorHp} onChange={handleFormChange} placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Alamat *</label>
                  <input name="alamat" value={form.alamat} onChange={handleFormChange} placeholder="Alamat lengkap Anda" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="email@contoh.com" />
                  </div>
                  <div className="form-group">
                    <label>Jenis Pelayanan *</label>
                    <select name="jenisPelayanan" value={form.jenisPelayanan} onChange={handleFormChange}>
                      <option value="">-- Pilih Pelayanan --</option>
                      {JENIS_PELAYANAN.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Keterangan</label>
                  <textarea name="keterangan" value={form.keterangan} onChange={handleFormChange} placeholder="Ceritakan kebutuhan atau pertanyaan Anda..." />
                </div>
                <button type="submit" className="form-submit" disabled={formLoading}>
                  {formLoading ? "Mengirim..." : "Kirim Pengajuan ✉️"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── KONTAK ── */}
      <section id="kontak" className="kontak-wrap">
        <div className="kontak-inner">
          <p className="section-label" style={{ color: C.light }}>Hubungi Kami</p>
          <h2 className="section-title heading" style={{ color:"white" }}>Kontak & Lokasi</h2>
          <div className="divider"/>
          <div className="kontak-grid">
            <div className="kontak-info">
              <div className="kontak-item">
                <div className="kontak-icon">📍</div>
                <div className="kontak-detail">
                  <h4>Alamat</h4>
                  <p>[Alamat Gereja]<br/>Manado, Sulawesi Utara</p>
                </div>
              </div>
              <div className="kontak-item">
                <div className="kontak-icon">🕐</div>
                <div className="kontak-detail">
                  <h4>Jam Ibadah</h4>
                  <p>Minggu: 08.00 & 17.00 WITA<br/>Rabu (Ibadah Doa): 18.30 WITA</p>
                </div>
              </div>
              <div className="kontak-item">
                <div className="kontak-icon">📞</div>
                <div className="kontak-detail">
                  <h4>Telepon</h4>
                  <p>[Nomor Telepon Gereja]</p>
                </div>
              </div>
              <a href="https://wa.me/628XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="wa-btn">
                <span>💬</span> Chat via WhatsApp
              </a>
            </div>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d498.55276866341154!2d124.92185879498726!3d1.5158039957287373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3287a1e2baf2aec7%3A0x5e2646f0697cc59!2sGBI%20Keluarga%20Allah%20Manado%20Paniki!5e0!3m2!1sid!2sid!4v1778634916897!5m2!1sid!2sid"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi GBI Keluarga Allah Manado"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-copy">
          © {new Date().getFullYear()} GBI Keluarga Allah Manado. Semua hak dilindungi.
        </p>
        <a href="/login" className="footer-admin">
          Admin
        </a>
      </footer>
    </div>
  );
}
