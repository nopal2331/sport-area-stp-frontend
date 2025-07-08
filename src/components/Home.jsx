import React from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleBookClick = () => {
    toast.info("Silahkan masuk jika sudah punya akun, atau daftar jika belum.");
    navigate("/login");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/background-home.png")' }}
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Konten */}
      <div className="relative z-10 text-white text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
          Sport Center Area - Solo Technopark
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 leading-relaxed drop-shadow-sm max-w-4xl">
          Area pusat olahraga modern untuk menjaga kesehatan dan kebugaran Anda.
          Nikmati berbagai fasilitas terbaik di kawasan Solo Technopark.
        </p>
        <Button
          size="lg"
          onClick={handleBookClick}
          className="bg-[#FFA673] text-black hover:bg-[#FFE3BB] transition-all duration-300 shadow-lg font-semibold"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Book Now
        </Button>
      </div>
    </section>
  );
}
