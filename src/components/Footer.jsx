import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3674B5] py-8">
      <div className="text-center text-white text-sm leading-relaxed">
        <p>Copyright © {year} | Solo Technopark</p>
        <p>Design & Developed by IT Solo Technopark</p>
      </div>
    </footer>
  );
}
