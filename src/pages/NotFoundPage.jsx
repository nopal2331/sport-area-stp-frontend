import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "user") {
      navigate("/users");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-[#E0F2FE] text-[#3674B5] rounded-full p-4 shadow-inner">
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-[#3674B5]">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground mb-4">
          Sepertinya halaman yang Anda cari tidak tersedia, mungkin telah
          dipindahkan atau alamatnya tidak benar.
        </p>
        <Button onClick={handleBack} className="w-full">
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
}
