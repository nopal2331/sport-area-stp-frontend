import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CalendarDays,
  Clock,
  FileText,
  MousePointerClick,
  Eye,
} from "lucide-react";

export default function Panduan() {
  const steps = [
    {
      icon: <MousePointerClick className="w-5 h-5 text-primary" />,
      title: "Klik Menu 'Sewa Lapangan'",
      desc: "Pilih jenis lapangan yang ingin Anda sewa: Basket atau Futsal.",
    },
    {
      icon: <CalendarDays className="w-5 h-5 text-primary" />,
      title: "Pilih Tanggal",
      desc: "Tentukan hari yang Anda inginkan untuk melakukan reservasi.",
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "Pilih Waktu",
      desc: "Pilih slot waktu yang masih tersedia sesuai kebutuhan Anda.",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      title: "Klik 'Pesan'",
      desc: "Jika semua sudah sesuai, klik tombol Pesan untuk mengkonfirmasi.",
    },
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "Buka Menu 'Laporan'",
      desc: "Masuk ke halaman Laporan untuk melihat daftar reservasi Anda.",
    },
    {
      icon: <Eye className="w-5 h-5 text-primary" />,
      title: "Lihat Detail Reservasi",
      desc: "Pilih waktu pengajuan dan klik 'Lihat Laporan' untuk melihat detailnya.",
    },
  ];

  return (
    <div className="pt-28 pb-10 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Panduan Reservasi Lapangan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="mt-1">{step.icon}</div>
              <div>
                <h3 className="font-semibold">{`${index + 1}. ${
                  step.title
                }`}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
          <Separator />
          <p className="text-sm text-muted-foreground text-center">
            Silahkan ikuti langkah-langkah di atas untuk melakukan reservasi
            dengan mudah dan cepat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
