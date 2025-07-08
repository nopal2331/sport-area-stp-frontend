import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Ban, FileMinus } from "lucide-react";

export default function Laporan() {
  const [printingId, setPrintingId] = useState(null);
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
      const response = await axios.get(
        `http://localhost:3000/api/bookings?status=approved&date=${tanggal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApprovedBookings(response.data.bookings || []);
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

    fetchLaporan(selectedDate);
  };

  const handleGenerateReport = async (bookingId, fieldType) => {
    setPrintingId(bookingId); 

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/reports/generate-pdf/${bookingId}`,
        {},
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `LAPANGAN-${fieldType.toUpperCase()}-${bookingId}-${selectedDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const text = await error.response.data.text();
        const errData = JSON.parse(text);
        toast.error(errData.message || "Gagal mengunduh laporan.");
      } else {
        toast.error("Terjadi kesalahan saat mengunduh laporan.");
      }
    } finally {
      setPrintingId(null); // Selesai loading
    }
  };

  return (
    <div className="pt-28 pb-10 w-full">
      <div className="max-w-4xl w-full mx-auto px-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Laporan Reservasi Lapangan
        </h1>
        <p className="text-center text-md text-gray-600 mb-6 max-w-2xl">
          Pilih tanggal reservasi yang telah disetujui untuk melihat dan
          mencetak laporan PDF dari sistem. Laporan hanya tersedia untuk hari
          kerja (Senin – Jumat).
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={todayStr}
            className="w-44 md:w-40 border-[#A1E3F9] focus:ring-[#3674B5] text-center"
          />
          <Button
            onClick={handleLihatLaporan}
            disabled={loading || !selectedDate || isHoliday(selectedDate)}
            className="bg-[#3674B5] hover:bg-[#2f65a1] text-white w-44"
          >
            {loading ? "Memuat..." : "Lihat Laporan"}
          </Button>
        </div>

        {selectedDate && isHoliday(selectedDate) && (
          <div className="flex items-center justify-center bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4 w-full">
            <Ban className="w-5 h-5 mr-2 text-red-600" />
            <p className="text-sm text-center">
              Hari <strong>Sabtu</strong> dan <strong>Minggu</strong> adalah
              hari <strong>libur</strong>. Tidak dapat mencetak laporan pada
              tanggal tersebut.
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-2 mt-8 w-full">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12 rounded-md" />
            ))}
          </div>
        ) : approvedBookings.length > 0 ? (
          <div className="mt-6 overflow-x-auto border border-[#A1E3F9] rounded-xl w-full">
            <Table>
              <TableHeader className="bg-[#A1E3F9] text-[#3674B5]">
                <TableRow className="divide-x divide-[#3674B5]">
                  <TableHead>No.</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Lapangan</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedBookings.map((booking, index) => (
                  <TableRow
                    key={booking.id}
                    className="border-b border-[#A1E3F9] divide-x divide-[#E0F4FD]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.user?.name || "-"}</TableCell>
                    <TableCell className="capitalize">
                      {booking.field_type}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.date).toLocaleDateString("id-ID")} -{" "}
                      {booking.time_slot}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-[#3674B5] p-0 h-auto cursor-pointer disabled:opacity-60"
                        onClick={() =>
                          handleGenerateReport(booking.id, booking.field_type)
                        }
                        disabled={printingId === booking.id}
                      >
                        {printingId === booking.id ? "Mencetak..." : "Cetak"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          selectedDate && (
            <div className="flex flex-col items-center justify-center mt-10 bg-[#F8FAFC] border border-[#A1E3F9] rounded-lg px-6 py-5 w-full">
              <FileMinus className="w-6 h-6 text-[#3674B5] mb-2" />
              <p className="text-gray-600 text-sm text-center">
                Tidak ada laporan untuk tanggal ini.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}