import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import Catalog from "./pages/home/Catalog";
import CreateShader from "./pages/studio/CreateShader";
import ShaderDetails from "./pages/home/ShaderDetails";
import Library from "./pages/library/Library"
import Checkout from "./pages/checkout/Checkout"
import { useAuthStore } from "./store/authStore";
import { useEffect, type JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route index element={<Login />} />

      <Route
        path="/catalog"
        element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shader/:id"
        element={
          <ProtectedRoute>
            <ShaderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/studio/create"
        element={
          <ProtectedRoute>
            <CreateShader />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/:shaderId"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
