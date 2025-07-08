import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/components/Home";
import KontakKami from "@/components/KontakKami";
import JamOperasional from "@/components/JamOperasional";
import Fasilitas from "@/components/Fasilitas";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Home />
      <Fasilitas />
      <JamOperasional />
      <KontakKami />
      <Footer />
    </>
  );
}
