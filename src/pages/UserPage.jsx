import Footer from "@/components/Footer";
import { NavbarUser } from "@/components/users/NavbarUser";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <>
      <NavbarUser />
      <div className="mx-auto w-full max-w-7xl px-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
