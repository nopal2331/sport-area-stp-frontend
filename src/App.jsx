import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UserPage";
import { Toaster } from "@/components/ui/sonner";
import UsersHome from "./components/users/HomeUser";
import NotFoundPage from "./pages/NotFoundPage";
import Home from "./components/Home";
import Panduan from "./components/users/Panduan";
import HomeAdmin from "./components/admin/HomeAdmin";
import Pesan from "./components/admin/Pesan";
import Basket from "./components/users/Basket";
import Futsal from "./components/users/Futsal";
import LaporanUser from "./components/users/LaporanUser";
import LaporanAdmin from "./components/admin/LaporanAdmin";
import UserList from "./components/admin/UserList";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />

      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route index element={<HomeAdmin />} />
          <Route path="pesan" element={<Pesan />} />
          <Route path="laporan" element={<LaporanAdmin />} />
          <Route path="userlist" element={<UserList />} />
        </Route>
        <Route path="/users" element={<UsersPage />}>
          <Route index element={<UsersHome />} />
          <Route path="panduan" element={<Panduan />} />
          <Route path="sewa-lapangan-basket" element={<Basket />} />
          <Route path="sewa-lapangan-Futsal" element={<Futsal />} />
          <Route path="laporan" element={<LaporanUser />} />
        </Route>

        {/* Halaman 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
