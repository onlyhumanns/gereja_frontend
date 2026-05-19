// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    const result = await login(data);
    if (result.success) {
      // Arahkan sesuai role — backend pakai uppercase (ADMIN / MAJELIS)
      const role = result.user?.role?.toUpperCase();
      if (role === "MAJELIS") {
        navigate("/majelis");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0faf8" }}>
      <div style={{ width:"100%", maxWidth:420, background:"white", borderRadius:8, padding:40, boxShadow:"0 8px 32px rgba(0,84,97,0.12)" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🕊️</div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.6rem", color:"#005461", marginBottom:4 }}>
            Login Admin
          </h2>
          <p style={{ fontSize:13, color:"#7a9a98" }}>GBI Keluarga Allah Manado</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fff0f0", border:"1px solid #ffcccc", color:"#cc3333", fontSize:13, textAlign:"center", padding:"10px 16px", borderRadius:6, marginBottom:20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#005461", marginBottom:6 }}>Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Masukkan email"
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #c5e0dc", borderRadius:6, fontSize:14, outline:"none", boxSizing:"border-box" }}
            />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#005461", marginBottom:6 }}>Password</label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Masukkan password"
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #c5e0dc", borderRadius:6, fontSize:14, outline:"none", boxSizing:"border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width:"100%", background:"#005461", color:"white", border:"none", padding:"12px", borderRadius:6, fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:1 }}
          >
            {loading ? "Memproses..." : "MASUK"}
          </button>
        </form>

        {/* Link register & kembali */}
        <div style={{ textAlign:"center", marginTop:20, display:"flex", flexDirection:"column", gap:8 }}>
          <p style={{ fontSize:13, color:"#7a9a98" }}>
            Belum punya akun?{" "}
            <Link to="/register" style={{ color:"#0c7779", textDecoration:"none", fontWeight:600 }}>
              Daftar di sini
            </Link>
          </p>
          <Link to="/" style={{ fontSize:13, color:"#7a9a98", textDecoration:"none" }}>
            ← Kembali ke Halaman Utama
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
