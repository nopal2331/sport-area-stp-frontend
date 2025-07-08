import React from "react";

export default function Fasilitas() {
  return (
    <section id="fasilitas" className="pt-20 px-4 md:px-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary drop-shadow-sm">
          Fasilitas Kami
        </h2>
        <p className="text-muted-foreground mt-2 max-w-4xl mx-auto text-base sm:text-lg leading-relaxed text-balance">
          Kami menyediakan fasilitas olahraga terbaik untuk kenyamanan dan
          keamanan Anda.
        </p>
      </div>

      {/* Lapangan Basket */}
      <div className="grid md:grid-cols-2 gap-10 items-center pb-20">
        <img
          src="/images/lapangan-basket.png"
          alt="Lapangan Basket"
          className="w-full h-auto rounded-2xl shadow-xl order-1 md:order-1"
        />

        <div className="order-2 md:order-1">
          <h3 className="text-2xl font-semibold mb-3">Lapangan Basket</h3>
          <p className="text-muted-foreground mb-5 text-base sm:text-lg leading-relaxed text-justify max-w-3xl">
            Lapangan basket outdoor kami menawarkan sarana olahraga terbuka yang
            aman dan nyaman, dengan permukaan lantai yang rata dan tidak licin,
            mendukung kelancaran permainan dalam berbagai cuaca. Lokasi
            strategis di kawasan Solo Technopark memberikan akses mudah bagi
            pelajar, komunitas, maupun pengunjung umum yang ingin berolahraga
            atau sekadar mengisi waktu luang secara aktif.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <img
                key={i}
                src={`/images/basket-${i}.png`}
                alt={`Lapangan Basket ${i}`}
                className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover rounded-lg shadow transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lapangan Futsal */}
      <div className="grid md:grid-cols-2 gap-10 items-center pb-20">
        <img
          src="/images/lapangan-futsal.png"
          alt="Lapangan Futsal"
          className="w-full h-auto rounded-2xl shadow-xl order-1 md:order-2"
        />

        <div className="order-2 md:order-1">
          <h3 className="text-2xl font-semibold mb-3">Lapangan Futsal</h3>
          <p className="text-muted-foreground mb-5 text-base sm:text-lg leading-relaxed text-justify max-w-3xl">
            Lapangan futsal outdoor kami menawarkan sarana olahraga terbuka yang
            aman dan nyaman, dengan permukaan lantai yang rata dan tidak licin,
            mendukung kelancaran permainan dalam berbagai cuaca. Lokasi
            strategis di kawasan Solo Technopark memberikan akses mudah bagi
            pelajar, komunitas, maupun pengunjung umum yang ingin berolahraga
            atau sekadar mengisi waktu luang secara aktif.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <img
                key={i}
                src={`/images/futsal-${i}.png`}
                alt={`Lapangan Futsal ${i}`}
                className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover rounded-lg shadow transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
