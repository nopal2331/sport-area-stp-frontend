import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function HomeUser() {
  const fieldTypes = React.useMemo(
    () => [
      { key: "basket", title: "Lapangan Basket", image: "lapangan-basket.png" },
      { key: "futsal", title: "Lapangan Futsal", image: "lapangan-futsal.png" },
    ],
    []
  );

  const [bookings, setBookings] = useState({
    basket: [],
    futsal: [],
  });

  const [showAll, setShowAll] = useState({
    basket: false,
    futsal: false,
  });

  const [loadingCount, setLoadingCount] = useState(fieldTypes.length);

  const fetchBookings = async (fieldKey) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings?field_type=${fieldKey}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.bookings || [];

      const now = new Date();

      const approved = data
        .filter((b) => b.status === "approved")
        .filter((b) => {
          const bookingDate = new Date(b.date);
          const [hourStr, minuteStr] = b.time_slot.split(":");
          bookingDate.setHours(parseInt(hourStr), parseInt(minuteStr), 0, 0);
          return bookingDate >= now;
        })
        .map((b) => ({
          nama: b.user?.name || "Pengguna",
          tanggal: new Date(b.date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          waktu: b.time_slot,
        }));

      setBookings((prev) => ({
        ...prev,
        [fieldKey]: approved,
      }));
    } catch (err) {
      toast.error("Gagal memuat data booking");
      console.error(err);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fieldTypes.forEach((field) => fetchBookings(field.key));
  }, [fieldTypes]);

  const renderTable = (field) => {
    const data = bookings[field.key] || [];
    const visibleBookings = showAll[field.key]
      ? data.slice(0, 10)
      : data.slice(0, 5);
    return (
      <Card key={field.key} className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl">{field.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={`/images/${field.image}`}
            alt={field.title}
            className="w-full h-64 object-cover rounded-xl shadow"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Nama Pemain</th>
                  <th className="border px-4 py-2">Tanggal</th>
                  <th className="border px-4 py-2">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {loadingCount > 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="border px-4 py-2">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="border px-4 py-2">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="border px-4 py-2">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    </tr>
                  ))
                ) : visibleBookings.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6">
                      <div className="flex flex-col items-center justify-center gap-3 px-4">
                        <img
                          src="/icons/empty-booking.svg"
                          alt="Kosong"
                          className="w-32 h-32 md:w-40 md:h-40 opacity-80 animate-bounce-slow"
                        />
                        <p className="text-muted-foreground text-sm md:text-base text-center max-w-xs md:max-w-md">
                          Belum ada jadwal booking untuk lapangan ini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visibleBookings.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="border px-4 py-2">{item.nama}</td>
                      <td className="border px-4 py-2">{item.tanggal}</td>
                      <td className="border px-4 py-2">{item.waktu}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowAll((prev) => ({
                    ...prev,
                    [field.key]: !prev[field.key],
                  }))
                }
              >
                {showAll[field.key] ? "Tutup" : "Lihat Semua"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  return (
    <div className="pt-28 pb-10 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Jadwal Pemakaian Lapangan</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Berikut adalah daftar jadwal penggunaan lapangan basket dan futsal
          yang telah disetujui. <br />
          Jadwal ditampilkan sesuai dengan data pemesanan yang berlaku.
        </p>
      </div>
      {loadingCount > 0 ? (
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {fieldTypes.map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {fieldTypes.map((field) => renderTable(field))}
        </div>
      )}
    </div>
  );
}