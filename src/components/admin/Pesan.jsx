import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Pesan() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data pending");
      const data = await response.json();
      setPendingBookings(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error("Gagal memuat reservasi pending");
    }
  };

  const fetchApprovedBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings?status=approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data approved");
      const result = await response.json();
      const data = result.bookings || [];
      setApprovedBookings(data);
    } catch {
      toast.error("Gagal memuat reservasi approved");
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
      toast.success(`Reservasi ${status === "approved" ? "disetujui" : "ditolak"}`);
      fetchPendingBookings();
      fetchApprovedBookings();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus data");
      toast.success("Reservasi berhasil dihapus");
      fetchApprovedBookings();
    } catch (err) {
      toast.error(err.message);
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

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPendingBookings(), fetchApprovedBookings()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const renderRow = (booking, index, type) => {
    const timeStatus = getTimeStatus(booking.date, booking.time_slot);

    return (
      <tr key={booking.id} className="odd:bg-white even:bg-gray-50 text-xs md:text-sm">
        <td className="p-2 md:p-3 border text-center">{index + 1}</td>
        <td className="p-2 md:p-3 border">LAP-{String(booking.id).padStart(3, "0")}</td>
        <td className="p-2 md:p-3 border">{booking.user?.name || "-"}</td>
        <td className="p-2 md:p-3 border capitalize">{booking.field_type}</td>
        <td className={`p-2 md:p-3 border ${timeStatus.className}`}>
          {new Date(booking.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          {booking.time_slot}
        </td>
        <td className="p-2 md:p-3 border">
          <div className="flex gap-2 justify-center">
            {type === "pending" ? (
              <>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "approved")}
                  className="text-green-600 hover:text-green-800"
                  title="Setujui"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "rejected")}
                  className="text-red-600 hover:text-red-800"
                  title="Tolak"
                >
                  <XCircle size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDelete(booking.id)}
                className="text-red-600 hover:text-red-800"
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

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Pending Bookings */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            List Pengajuan Reservasi (Pending)
          </h2>
          <div className="w-full overflow-x-auto border rounded-xl">
            <table className="min-w-[640px] md:min-w-full border text-xs md:text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 md:p-3 border">No.</th>
                  <th className="p-2 md:p-3 border">ID</th>
                  <th className="p-2 md:p-3 border">Nama Pemain</th>
                  <th className="p-2 md:p-3 border">Jenis Lapangan</th>
                  <th className="p-2 md:p-3 border">Waktu Main</th>
                  <th className="p-2 md:p-3 border">Opsi</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.length === 0 ? (
                  <tr>
                    <td className="p-3 border text-center" colSpan={6}>
                      {loading ? "Memuat..." : "Tidak ada reservasi pending."}
                    </td>
                  </tr>
                ) : (
                  pendingBookings.map((b, i) => renderRow(b, i, "pending"))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Approved Bookings */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            List Reservasi Disetujui
          </h2>
          <div className="w-full overflow-x-auto border rounded-xl">
            <table className="min-w-[640px] md:min-w-full border text-xs md:text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 md:p-3 border">No.</th>
                  <th className="p-2 md:p-3 border">ID</th>
                  <th className="p-2 md:p-3 border">Nama Pemain</th>
                  <th className="p-2 md:p-3 border">Jenis Lapangan</th>
                  <th className="p-2 md:p-3 border">Waktu Main</th>
                  <th className="p-2 md:p-3 border">Opsi</th>
                </tr>
              </thead>
              <tbody>
                {approvedBookings.length === 0 ? (
                  <tr>
                    <td className="p-3 border text-center" colSpan={6}>
                      {loading ? "Memuat..." : "Tidak ada reservasi approved."}
                    </td>
                  </tr>
                ) : (
                  approvedBookings.map((b, i) => renderRow(b, i, "approved"))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
