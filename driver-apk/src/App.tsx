import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import api from "./lib/axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const { token, updateDriver } = useAuthStore();

  useEffect(() => {
    if (token) {
      api
        .get("/driver/me")
        .then((res) => {
          if (res.data?.user) {
            updateDriver(res.data.user);
          }
        })
        .catch(() => {
          // Token expired or invalid: handled by 401 axios interceptor
        });
    }
  }, [token, updateDriver]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
