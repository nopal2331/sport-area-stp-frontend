import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Clock4, CheckCircle2, XCircle, CalendarX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const timeslots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
];

const gallery = ["lapangan-basket.png", "basket-1.png", "basket-2.png"];

const isWeekend = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

const isPastTimeSlot = (slot, selectedDate) => {
  const now = new Date();
  const [startHour, startMinute] = slot.split(" - ")[0].split(":").map(Number);
  const selected = new Date(selectedDate);
  const isToday = now.toDateString() === selected.toDateString();

  if (!isToday) {
    return false;
  }

  const slotTime = new Date(selected);
  slotTime.setHours(startHour, startMinute, 0, 0);
  return now > slotTime;
};

const generateUpcomingDates = (maxDays = 14) => {
  const dates = [];
  const today = new Date();
  let count = 0;
  let i = 0;

  while (count < maxDays) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      dates.push({
        dayName: date.toLocaleDateString("id-ID", { weekday: "long" }),
        dateText: date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
        }),
        year: date.getFullYear(),
        value: date.toISOString().split("T")[0],
      });
      count++;
    }
    i++;
  }

  return dates;
};

export default function Basket() {
  const [dateOptions] = useState(generateUpcomingDates());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [mainImage, setMainImage] = useState(gallery[0]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const fetchBookedSlots = async (date) => {
    try {
      setFetchingSlots(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const res = await axios.get("http://localhost:3000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
        params: { field_type: "basket", date },
      });

      const bookedTimes = res.data.bookings
        .filter((b) => ["pending", "approved"].includes(b.status))
        .map((b) => b.time_slot);

      setBookedSlots(bookedTimes);
    } catch (err) {
      console.error("Gagal fetch booked slots:", err);
    } finally {
      setFetchingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Anda harus login terlebih dahulu");
    }
    if (selectedSlots.length === 0) {
      return toast.error("Pilih minimal satu waktu");
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedSlots.map((slot) =>
          axios.post(
            "http://localhost:3000/api/bookings",
            {
              field_type: "basket",
              date: selectedDate,
              time_slot: slot,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      toast.success(`Reservasi berhasil untuk ${selectedSlots.length} waktu`);
      setSelectedSlots([]);
      await fetchBookedSlots(selectedDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal melakukan reservasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="flex-grow py-30">
        <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Lapangan Basket</h2>
            <img
              src={`/images/${mainImage}`}
              alt="Lapangan Basket"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-96 object-cover rounded-xl shadow-md transition-all duration-300"
            />
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 px-1 scroll-snap-x scroll-smooth">
              {gallery.map((file, i) => (
                <img
                  key={i}
                  src={`/images/${file}`}
                  onClick={() => setMainImage(file)}
                  className={`shrink-0 w-28 h-20 sm:w-48 sm:h-24 md:w-40 md:h-28 lg:w-48 lg:h-32 xl:w-[169px] xl:h-32 object-cover rounded-xl border-2 cursor-pointer transition-all duration-200 scroll-snap-align-start ${
                    mainImage === file
                      ? "border-4 border-[#3674B5]"
                      : "border-gray-200"
                  }`}
                  alt={`Basket ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-6 leading-relaxed text-justify">
              Silakan pilih tanggal dan jam yang tersedia untuk melakukan
              reservasi lapangan. Pastikan waktu yang kamu pilih belum digunakan
              oleh pengguna lain agar proses reservasi berhasil.
            </p>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Pilih Tanggal</label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dateOptions.map((date) => (
                  <button
                    key={date.value}
                    className={`min-w-[110px] text-center px-4 py-2 rounded-lg shadow-md text-sm border ${
                      selectedDate === date.value
                        ? "bg-[#3674B5] text-white border-[#3674B5]"
                        : "bg-white text-[#3674B5] border-[#A1E3F9] hover:bg-[#A1E3F9]/40"
                    }`}
                    onClick={() => {
                      if (isWeekend(date.value)) {
                        toast(
                          "Reservasi tidak tersedia pada hari Sabtu dan Minggu",
                          {
                            icon: (
                              <CalendarX className="w-4 h-4 text-red-500" />
                            ),
                          }
                        );
                        return;
                      }
                      setSelectedDate(date.value);
                      setSelectedSlots([]);
                    }}
                  >
                    <div className="font-semibold">{date.dayName}</div>
                    <div className="text-xs">{date.dateText}</div>
                    <div className="text-xs font-medium">{date.year}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Pilih Waktu</label>
              {fetchingSlots ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeslots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlots.includes(slot);
                    const isPast = isPastTimeSlot(slot, selectedDate);
                    let bgClass =
                      "bg-white text-[#3674B5] border border-[#578FCA] hover:bg-[#A1E3F9]/40";
                    let text = "Waktu Tersedia";
                    let icon = <Clock4 className="w-4 h-4 mr-1" />;

                    if (isPast) {
                      bgClass =
                        "bg-red-100 text-red-600 border-red-200 cursor-not-allowed";
                      text = "Waktu Sudah Lewat";
                      icon = <XCircle className="w-4 h-4 mr-1 text-red-600" />;
                    } else if (isBooked) {
                      bgClass =
                        "bg-gray-100 text-gray-500 border-gray-300 font-medium cursor-not-allowed";
                      text = "Waktu Sudah Terisi";
                      icon = <XCircle className="w-4 h-4 mr-1 text-gray-400" />;
                    } else if (isSelected) {
                      bgClass = "bg-[#3674B5] text-white border-[#3674B5]";
                      text = "Waktu Dipilih";
                      icon = (
                        <CheckCircle2 className="w-4 h-4 mr-1 text-white" />
                      );
                    }

                    return (
                      <button
                        key={slot}
                        onClick={() => !isBooked && !isPast && toggleSlot(slot)}
                        className={`min-h-[60px] rounded-xl py-2 px-3 text-sm font-semibold transition duration-200 flex flex-col items-center justify-center text-center ${bgClass}`}
                        disabled={isBooked || isPast || loading}
                      >
                        <div>{slot}</div>
                        <div className="text-xs font-normal flex items-center">
                          {icon}
                          {text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedSlots.length > 0 && (
              <div className="mb-4 p-3 bg-[#F9F3EF] border-[#456882] rounded-md">
                <p className="text-sm text-[#1B3C53]">
                  <strong>Jadwal yang dipilih:</strong>{" "}
                  {selectedSlots.join(", ")}
                </p>
              </div>
            )}

            <Button
              className="w-full px-6 py-3 bg-[#3674B5] text-white rounded-xl hover:bg-[#578FCA] disabled:bg-gray-400"
              disabled={selectedSlots.length === 0 || loading}
              onClick={handleBooking}
            >
              {loading
                ? "Memproses..."
                : `Pesan Sekarang${
                    selectedSlots.length > 1
                      ? ` (${selectedSlots.length} Waktu)`
                      : ""
                  }`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}