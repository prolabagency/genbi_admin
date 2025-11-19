import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/login";
import Layout from "./components/layout";
import Users from "./pages/users";
import AdminProfile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import CreateLocation from "./pages/create-location";
import HealthServer from "./pages/healthy-server";
import Category from "./pages/category";
import Tour from "./pages/tour";
import Company from "./pages/company";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (window.location.pathname == "/") {
      navigate("/dashboard");
    }
  }, [window.location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<AdminProfile />} />
        <Route path="/create-location" element={<CreateLocation />} />
        <Route path="/users" element={<Users />} />
        <Route path="/health-server" element={<HealthServer />} />
        <Route path="/category" element={<Category />} />
        <Route path="/tour-add" element={<Tour />} />
        <Route path="/company" element={<Company />} />
      </Route>
    </Routes>
  );
}

// 6 серия 7:35
export default App;
