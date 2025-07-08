import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LaporanUser() {
  const [selectedDate, setSelectedDate] = useState("");
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const isHoliday = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 6 || day === 0;
  };

  const fetchLaporan = async (tanggal) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/bookings?status=approved&date=${tanggal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data laporan");
      }

      const data = await response.json();
      setApprovedBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mengambil laporan.");
    } finally {
      setLoading(false);
    }
  };

  const handleLihatLaporan = () => {
    if (!selectedDate) {
      toast.error("Silakan pilih tanggal terlebih dahulu");
      return;
    }

    if (isHoliday(selectedDate)) {
      toast.error("Hari Sabtu dan Minggu adalah hari libur.");
      return;
    }

    fetchLaporan(selectedDate);
  };

  const handleGenerateReport = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/reports/generate-pdf/${bookingId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal generate laporan");
      }

      // Berhasil, unduh blob PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-booking-${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow py-30">
        <div className="max-w-4xl mx-auto lg:ml-20">
          <h1 className="text-lg font-semibold mb-6">
            Pilih Tanggal Reservasi Untuk Melihat Laporan
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={todayStr}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md"
            />

            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleLihatLaporan}
              disabled={loading || !selectedDate || isHoliday(selectedDate)}
            >
              {loading ? "Memuat..." : "Lihat Laporan"}
            </Button>
          </div>

          {selectedDate && isHoliday(selectedDate) && (
            <p className="text-red-500 mt-3">
              Hari Sabtu dan Minggu adalah hari libur. Tidak bisa mencetak laporan.
            </p>
          )}

          {approvedBookings.length > 0 && (
            <div className="mt-10 overflow-x-auto border rounded-xl">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3 border">No.</th>
                    <th className="p-3 border">Nama</th>
                    <th className="p-3 border">Jenis Lapangan</th>
                    <th className="p-3 border">Tanggal & Waktu</th>
                    <th className="p-3 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedBookings.map((booking, index) => (
                    <tr key={booking.id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{booking.user?.name || "-"}</td>
                      <td className="p-3 border capitalize">{booking.field_type}</td>
                      <td className="p-3 border">
                        {new Date(booking.date).toLocaleDateString("id-ID")} -{" "}
                        {booking.time_slot}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleGenerateReport(booking.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Cetak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedDate && !loading && approvedBookings.length === 0 && (
            <p className="text-gray-600 mt-6">
              Tidak ada reservasi disetujui pada tanggal ini.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
