// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home             from "./pages/Home";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Dashboard        from "./pages/Dashboard";
import DashboardMajelis from "./pages/DashboardMajelis";
import Terhubung        from "./pages/Terhubung";
import Ibadah           from "./pages/Ibadah";
import Galeri           from "./pages/Galeri";
import Pengumuman       from "./pages/Pengumuman";
import LiveStreaming     from "./pages/LiveStreaming";
import Layout           from "./components/Layout";

const isMajelis = (user) => user?.role?.toUpperCase() === "MAJELIS";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isMajelis(user)) return <Navigate to="/majelis" replace />;
  return children;
};

const MajelisRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isMajelis(user)) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return children;
  return isMajelis(user)
    ? <Navigate to="/majelis" replace />
    : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          <Route path="/majelis"       element={<MajelisRoute><DashboardMajelis /></MajelisRoute>} />

          <Route path="/dashboard"     element={<AdminRoute><Layout><Dashboard /></Layout></AdminRoute>} />
          <Route path="/terhubung"     element={<AdminRoute><Layout><Terhubung /></Layout></AdminRoute>} />
          <Route path="/ibadah"        element={<AdminRoute><Layout><Ibadah /></Layout></AdminRoute>} />
          <Route path="/galeri"        element={<AdminRoute><Layout><Galeri /></Layout></AdminRoute>} />
          <Route path="/pengumuman"    element={<AdminRoute><Layout><Pengumuman /></Layout></AdminRoute>} />
          <Route path="/livestreaming" element={<AdminRoute><Layout><LiveStreaming /></Layout></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;