import { NavbarAdmin } from "@/components/admin/NavbarAdmin";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <NavbarAdmin />
      <div className="mx-auto w-full max-w-7xl px-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
