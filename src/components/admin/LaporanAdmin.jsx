import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LaporanAdmin() {
  const [selectedDate, setSelectedDate] = useState("");
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReportId, setLoadingReportId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchTime, setSearchTime] = useState("");

  const isHoliday = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 6 || day === 0;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateBookingId = (id) => {
    return `LAP-${String(id).padStart(3, "0")}`;
  };

  const fetchLaporan = async (tanggal) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(
        `http://localhost:3000/api/bookings?status=approved&date=${tanggal}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApprovedBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching laporan:", err);
      toast.error("Terjadi kesalahan saat mengambil laporan.");
      setApprovedBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (bookingId) => {
    try {
      setLoadingReportId(bookingId);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch(
        `http://localhost:3000/api/reports/generate-pdf/${bookingId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal generate laporan");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-booking-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message);
    } finally {
      setLoadingReportId(null);
    }
  };

  const handleLihatLaporan = () => {
    if (!selectedDate) {
      return toast.error("Silakan pilih tanggal terlebih dahulu");
    }
    if (isHoliday(selectedDate)) {
      return toast.error("Hari Sabtu dan Minggu adalah hari libur.");
    }
    fetchLaporan(selectedDate);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setApprovedBookings([]);
  };

  const filteredBookings = approvedBookings.filter((booking) => {
    const matchesName = booking.user?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesTime = booking.time_slot
      ?.toLowerCase()
      .includes(searchTime.toLowerCase());
    return matchesName && matchesTime;
  });

  const groupedBookings = {
    futsal: filteredBookings.filter((booking) => booking.field_type === "futsal"),
    basket: filteredBookings.filter((booking) => booking.field_type === "basket"),
  };

  const renderLoadingSpinner = () => (
    <svg
      className="w-4 h-4 animate-spin text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  const renderBookingTable = (type) => {
    const bookings = groupedBookings[type];
    
    if (bookings.length === 0) return null;

    return (
      <div key={type} className="mb-10">
        <h2 className="text-md font-bold mb-2 capitalize">
          Lapangan {type}
        </h2>
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border font-medium">No.</th>
                <th className="p-3 border font-medium">ID</th>
                <th className="p-3 border font-medium">Nama</th>
                <th className="p-3 border font-medium">Tanggal & Jam</th>
                <th className="p-3 border font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{generateBookingId(booking.id)}</td>
                  <td className="p-3 border">{booking.user?.name || "-"}</td>
                  <td className="p-3 border text-green-700 font-medium">
                    {formatDate(booking.date)} - {booking.time_slot}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleGenerateReport(booking.id)}
                      disabled={loadingReportId === booking.id}
                      className={`text-blue-600 hover:underline flex items-center gap-2 transition-opacity ${
                        loadingReportId === booking.id
                          ? "opacity-60 pointer-events-none"
                          : ""
                      }`}
                    >
                      {loadingReportId === booking.id ? (
                        <>
                          {renderLoadingSpinner()}
                          Mencetak...
                        </>
                      ) : (
                        "Cetak"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-lg font-semibold mb-6">Laporan Reservasi</h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleLihatLaporan}
              disabled={loading || !selectedDate || isHoliday(selectedDate)}
              className="whitespace-nowrap"
            >
              {loading ? "Memuat..." : "Lihat Laporan"}
            </Button>
          </div>

          {selectedDate && !isHoliday(selectedDate) && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
              </div>
              {filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada data booking yang ditemukan.</p>
                </div>
              )}
              {renderBookingTable("futsal")}
              {renderBookingTable("basket")}
            </>
          )}

          {selectedDate && isHoliday(selectedDate) && (
            <div className="text-center py-8">
              <p className="text-orange-600 font-medium">
                Hari Sabtu dan Minggu adalah hari libur.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}