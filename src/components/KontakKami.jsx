import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function KontakKami() {
  return (
    <section id="kontak-kami" className="bg-white border-t py-16 px-4 md:px-20">
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto text-sm text-muted-foreground">
        {/* Kolom 1: Logo dan Media Sosial */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="logo" className="h-10" />
            <p className="text-base font-semibold text-black">
              Solo Technopark
            </p>
          </div>
          <p className="leading-relaxed text-justify">
            Menuju kawasan Solo Technopark yang inovatif dan berdaya saing
            internasional.
          </p>
          <div>
            <p className="font-semibold text-black mb-2">Ikuti Kami</p>
            <ul className="space-y-3">
              {[
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/solotechnopark",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/solotechnopark_official",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                  href: "https://www.youtube.com/@solotechnopark5339",
                },
                {
                  icon: Twitter,
                  label: "Twitter",
                  href: "https://x.com/technopark_solo",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/solo-technopark",
                },
              ].map(({ icon, label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:text-primary transition-colors cursor-pointer"
                  >
                    {React.createElement(icon, { className: "w-5 h-5" })}{" "}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kolom 2: Kontak */}
        <div className="space-y-4">
          <p className="font-semibold text-black">Hubungi Kami</p>
          <div className="flex items-start gap-2">
            <MapPin className="w-9 h-9" />
            <p className="text-justify">
              Kawasan Sains dan Teknologi - Solo Technopark
              <br />
              Jl. Ki Hajar Dewantara No.19, Jebres, Kec. Jebres, Kota Surakarta,
              Jawa Tengah 57126
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <p>(+62) 271 666662</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <p>info@solotechnopark.id</p>
          </div>
        </div>

        {/* Kolom 3: Peta Lokasi */}
        <div>
          <p className="font-semibold text-black mb-2">Temukan Kami</p>
          <div className="rounded-md overflow-hidden shadow w-full aspect-[4/3] border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.173399195789!2d110.85129157455047!3d-7.556063874610826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a16e2b5ffa643%3A0xa0bf36ec85b94dfb!2sSolo%20Techno%20Park!5e0!3m2!1sid!2sid!4v1751767877553!5m2!1sid!2sid"
              className="w-full h-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Solo Technopark"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
