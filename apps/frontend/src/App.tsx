import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import Catalog from "./pages/home/Catalog";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Catalog />} />

      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
