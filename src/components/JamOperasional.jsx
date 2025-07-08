import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JamOperasional() {
  return (
    <section
      id="jam-operasional"
      className="py-20 px-4 md:px-20 bg-[#3674B5] text-white"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-sm">
          Jam Operasional Kami
        </h2>
        <p className="mt-2 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed text-balance">
          Waktu operasional masing-masing lapangan di STP Sport Area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Lapangan Basket */}
        <Card className="bg-white text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <img
                className="w-6 h-6"
                src="/icons/basketball.svg"
                alt="Lapangan Basket"
              />
              Lapangan Basket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <div
                key={day}
                className="flex justify-between border-b py-1 text-gray-700"
              >
                <span>{day}</span>
                <span className="font-medium text-primary">09.00 - 21.00 WIB</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-destructive">
              <span>Sabtu & Minggu</span>
              <span>Tutup</span>
            </div>
          </CardContent>
        </Card>

        {/* Lapangan Futsal */}
        <Card className="bg-white text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <img
                className="w-6 h-6"
                src="/icons/soccer-ball.svg"
                alt="Lapangan Futsal"
              />
              Lapangan Futsal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <div
                key={day}
                className="flex justify-between border-b py-1 text-gray-700"
              >
                <span>{day}</span>
                <span className="font-medium text-primary">09.00 - 21.00 WIB</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-destructive">
              <span>Sabtu & Minggu</span>
              <span>Tutup</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
