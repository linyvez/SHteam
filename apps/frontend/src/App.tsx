import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import Catalog from "./pages/home/Catalog";
import CreateShader from "./pages/studio/CreateShader";
import ShaderDetails from "./pages/home/ShaderDetails";
import Library from "./pages/library/Library"
import Checkout from "./pages/checkout/Checkout"

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/catalog" element={<Catalog />} />
      <Route index element={<Catalog />} />

      <Route path="/shader/:id" element={<ShaderDetails />} />

      <Route path="/studio/create" element={<CreateShader />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/library" element={<Library />} />

      <Route path="/checkout/:shaderId" element={<Checkout />} />

    </Routes>
  );
}

export default App;
