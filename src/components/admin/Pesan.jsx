import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Pesan() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchTime, setSearchTime] = useState("");

  const token = localStorage.getItem("token");

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data pending");
      
      const data = await response.json();
      setPendingBookings(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      toast.error("Gagal memuat reservasi pending");
      console.error("Error fetching pending bookings:", error);
    }
  };

  const fetchApprovedBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings?status=approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data approved");
      
      const result = await response.json();
      setApprovedBookings(result.bookings || []);
    } catch (error) {
      toast.error("Gagal memuat reservasi approved");
      console.error("Error fetching approved bookings:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Gagal update status");
      
      const statusText = status === "approved" ? "disetujui" : "ditolak";
      toast.success(`Reservasi ${statusText}`);
      
      await Promise.all([fetchPendingBookings(), fetchApprovedBookings()]);
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus reservasi ini?")) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Gagal menghapus data");
      
      toast.success("Reservasi berhasil dihapus");
      await fetchApprovedBookings();
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting booking:", error);
    }
  };

  const getTimeStatus = (date, timeSlot) => {
    const now = new Date();
    const bookingDate = new Date(date);
    const timeMatch = timeSlot.match(/(\d{2}):(\d{2})/);
    
    if (!timeMatch) return { status: 'unknown', className: '' };
    
    const [, hours, minutes] = timeMatch;
    bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (now > bookingDate) {
      return { status: 'expired', className: 'text-red-600 bg-red-50' };
    }
    return { status: 'upcoming', className: 'text-green-600 bg-green-50' };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatBookingId = (id) => `LAP-${String(id).padStart(3, "0")}`;

  const getFilteredBookings = (fieldType) => {
    return approvedBookings.filter(booking => {
      const matchesType = booking.field_type === fieldType;
      const matchesName = booking.user?.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesTime = booking.time_slot.includes(searchTime);
      
      return matchesType && matchesName && matchesTime;
    });
  };

  const renderTableRow = (booking, index, type) => {
    const timeStatus = getTimeStatus(booking.date, booking.time_slot);

    return (
      <tr key={booking.id} className="odd:bg-white even:bg-gray-50 text-xs md:text-sm">
        <td className="p-2 md:p-3 border text-center">{index + 1}</td>
        <td className="p-2 md:p-3 border">{formatBookingId(booking.id)}</td>
        <td className="p-2 md:p-3 border">{booking.user?.name || "-"}</td>
        <td className="p-2 md:p-3 border">{booking.user?.phone || "-"}</td>
        <td className="p-2 md:p-3 border capitalize">{booking.field_type}</td>
        <td className={`p-2 md:p-3 border ${timeStatus.className}`}>
          {formatDate(booking.date)} {booking.time_slot}
        </td>
        <td className="p-2 md:p-3 border">
          <div className="flex gap-2 justify-center">
            {type === "pending" ? (
              <>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "approved")}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  title="Setujui"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "rejected")}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Tolak"
                >
                  <XCircle size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDelete(booking.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderTable = (bookings, type, title) => (
    <div className="mb-6">
      {title && <h3 className="text-md font-semibold mb-2">{title}</h3>}
      <div className="w-full overflow-x-auto border rounded-xl">
        <table className="min-w-[640px] md:min-w-full border text-xs md:text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 md:p-3 border">No.</th>
              <th className="p-2 md:p-3 border">ID</th>
              <th className="p-2 md:p-3 border">Nama Pemain</th>
              <th className="p-2 md:p-3 border">No. HP</th>
              <th className="p-2 md:p-3 border">Jenis Lapangan</th>
              <th className="p-2 md:p-3 border">Waktu Main</th>
              <th className="p-2 md:p-3 border">Opsi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td className="p-3 border text-center text-gray-500" colSpan={7}>
                  {loading ? "Memuat..." : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => renderTableRow(booking, index, type))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPendingBookings(), fetchApprovedBookings()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            List Pengajuan Reservasi
          </h2>
          {renderTable(pendingBookings, "pending")}
        </section>

        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            List Reservasi Disetujui
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari nama pemain"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Filter jam (contoh: 09:00)"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {renderTable(
            getFilteredBookings("futsal"),
            "approved",
            "Lapangan Futsal"
          )}

          {renderTable(
            getFilteredBookings("basket"),
            "approved",
            "Lapangan Basket"
          )}
        </section>
      </main>
    </div>
  );
}