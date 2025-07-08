import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const timeslots = [
  "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
  "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00",
  "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00",
  "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00",
];

const gallery = ["basket-1.png", "basket-1.png", "basket-1.png", "basket-1.png"];

const isWeekend = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

const isPastTimeSlot = (slot, selectedDate) => {
  const now = new Date();
  const [startHour, startMinute] = slot.split(" - ")[0].split(":").map(Number);
  const selected = new Date(selectedDate);
  const isToday = now.toDateString() === selected.toDateString();

  if (!isToday) return false;

  const slotTime = new Date(selected);
  slotTime.setHours(startHour, startMinute, 0, 0);

  return now > slotTime;
};

export default function Basket() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [mainImage, setMainImage] = useState(gallery[0]);
  const [loading, setLoading] = useState(false);

  const fetchBookedSlots = async (date) => {
    try {
      const token = localStorage.getItem("token");  
      if (!token) return;

      const response = await fetch(`http://localhost:3000/api/bookings?field_type=Basket&date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookedTimes = data.bookings
          .filter(b => ["pending", "approved"].includes(b.status))
          .map(b => b.time_slot);
        setBookedSlots(bookedTimes);
      }
    } catch (err) {
      console.error("Gagal fetch booked slots:", err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Anda harus login terlebih dahulu");

    if (selectedSlots.length === 0) {
      toast.error("Pilih minimal satu slot waktu");
      return;
    }

    setLoading(true);
    try {
      const bookingPromises = selectedSlots.map(async (slot) => {
        const response = await fetch("http://localhost:3000/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            field_type: "basket",
            date: selectedDate,
            time_slot: slot,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal melakukan reservasi");
        }

        return response.json();
      });

      await Promise.all(bookingPromises);
      toast.success(`Reservasi berhasil untuk ${selectedSlots.length} slot waktu`);
      setSelectedSlots([]);
      await fetchBookedSlots(selectedDate); // refresh status
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow py-30">
        <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gambar */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Lapangan Basket</h2>
            <img
              className="rounded-xl shadow-md border border-gray-200 w-full object-cover h-64 md:h-80 lg:h-96"
              src={`/images/${mainImage}`}
              alt="Lapangan Basket"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {gallery.map((file, i) => (
                <img
                  key={i}
                  src={`/images/${file}`}
                  onClick={() => setMainImage(file)}
                  className={`w-24 h-16 object-cover rounded-md border cursor-pointer transition ${
                    mainImage === file ? "ring-2 ring-green-500" : ""
                  }`}
                  alt={`Basket ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="text-gray-700 mb-6">
              Pilih tanggal dan waktu untuk melakukan reservasi lapangan olahraga sesuai kebutuhanmu. Pastikan slot yang kamu pilih belum terisi.
            </p>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Pilih Tanggal</label>
              <input
                type="date"
                className="border px-3 py-2 rounded-md w-full"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (isWeekend(newDate)) {
                    toast.error("Reservasi tidak tersedia pada hari Sabtu dan Minggu");
                    return;
                  }
                  setSelectedDate(newDate);
                  setSelectedSlots([]);
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Pilih Waktu</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeslots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlots.includes(slot);
                  const isPast = isPastTimeSlot(slot, selectedDate);

                  let bgClass = "bg-white hover:bg-green-50 border-gray-200 hover:border-green-300";
                  let text = "Tersedia";

                  if (isPast) {
                    bgClass = "bg-red-100 text-red-600 border-red-200 cursor-not-allowed";
                    text = "Sudah Lewat";
                  } else if (isBooked) {
                    bgClass = "border border-black text-black bg-white font-medium cursor-not-allowed";
                    text = "Sudah Di booking";
                  } else if (isSelected) {
                    bgClass = "bg-green-600 text-white border-green-600";
                    text = "Dipilih";
                  }

                  return (
                    <button
                      key={slot}
                      onClick={() => !isBooked && !isPast && toggleSlot(slot)}
                      className={`border rounded-lg py-2 px-3 text-sm text-center transition-all duration-200 ${bgClass}`}
                      disabled={isBooked || isPast || loading}
                    >
                      <div className="font-medium">{slot}</div>
                      <div className="text-xs">{text}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSlots.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Slot yang dipilih:</strong> {selectedSlots.join(", ")}
                </p>
              </div>
            )}

            <Button
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
              disabled={selectedSlots.length === 0 || loading}
              onClick={handleBooking}
            >
              {loading
                ? "Memproses..."
                : `Pesan Sekarang${selectedSlots.length > 1 ? ` (${selectedSlots.length} slot)` : ""}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
