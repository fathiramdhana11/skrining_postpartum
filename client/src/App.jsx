import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/LandingPage";
import SkriningPage from "./pages/SkriningPage";
import NakesDashboard from "./pages/dashboard/NakesDashboard";
import LengkapiProfil from "./pages/dashboard/LengkapiProfil";
import RiwayatSkrining from "./pages/dashboard/RiwayatSkrining";
import DataPasienPage from "./pages/dashboard/DataPasienPage";
import DaftarSkriningPage from "./pages/dashboard/DaftarSkriningPage";
import TimNakesPage from "./pages/dashboard/TimNakesPage";
import { Toaster } from 'sonner';

// Proteksi Route Sederhana
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika role salah, buang ke dashboard yang sesuai (atau landing page)
    return user.role === "tenagakesehatan"
      ? <Navigate to="/nakes/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // Inactivity Auto-Logout (30 Menit)
  useEffect(() => {
    let timeoutId;
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 Menit dalam milidetik

    const handleLogout = () => {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("profileData");
        window.location.href = "/login?error=timeout";
      }
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, TIMEOUT_DURATION);
    };

    // Events to track user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress',
      'scroll', 'touchstart', 'click'
    ];

    // Initial timer
    resetTimer();

    // Add listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  // Global Session Listener (Interseptor Fetch)
  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Jika session duplikat (login di device lain)
      if (response.status === 401) {
        const clone = response.clone();
        try {
          const data = await clone.json();
          if (data.code === 'DUPLICATE_SESSION') {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("profileData");

            // Redirect dengan pesan khusus
            window.location.href = "/login?error=session_conflict";
          }
        } catch (e) {
          // Bukan JSON atau error lain, abaikan
        }
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<LandingPage />} />

        {/* Form Lengkapi Profil Pasien */}
        <Route
          path="/lengkapi-profil"
          element={
            <PrivateRoute allowedRoles={["pasien", "superadmin"]}>
              <LengkapiProfil />
            </PrivateRoute>
          }
        />

        <Route
          path="/riwayat-skrining"
          element={
            <PrivateRoute allowedRoles={["pasien", "superadmin"]}>
              <RiwayatSkrining />
            </PrivateRoute>
          }
        />

        <Route
          path="/skrining"
          element={
            <PrivateRoute allowedRoles={["pasien", "superadmin"]}>
              <SkriningPage />
            </PrivateRoute>
          }
        />

        {/* Dashboard Nakes (Admin-like) */}
        <Route
          path="/nakes/dashboard"
          element={
            <PrivateRoute allowedRoles={["tenagakesehatan", "superadmin"]}>
              <NakesDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/nakes/pasien"
          element={
            <PrivateRoute allowedRoles={["tenagakesehatan", "superadmin"]}>
              <DataPasienPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nakes/skrining"
          element={
            <PrivateRoute allowedRoles={["tenagakesehatan", "superadmin"]}>
              <DaftarSkriningPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nakes/tim"
          element={
            <PrivateRoute allowedRoles={["tenagakesehatan", "superadmin"]}>
              <TimNakesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
