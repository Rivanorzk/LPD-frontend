"use client"

import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Bell,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const features = [
    {
      icon: MessageCircle,
      title: "Thread Laporan",
      desc: "Laporkan masalah lingkungan sekitar dengan format thread modern seperti media sosial.",
    },
    {
      icon: Bell,
      title: "Update Real-time",
      desc: "Pantau perkembangan laporan mulai dari diproses hingga selesai.",
    },
    {
      icon: ShieldCheck,
      title: "Aman & Transparan",
      desc: "Setiap laporan tercatat dan dapat dipantau oleh masyarakat.",
    },
  ]

  const stats = [
    {
      number: "12K+",
      label: "Laporan Masuk",
    },
    {
      number: "8K+",
      label: "Laporan Selesai",
    },
    {
      number: "3K+",
      label: "Warga Aktif",
    },
  ]

  return (
  <main className="min-h-screen bg-[#F7FAF9] overflow-x-hidden">
    {/* NAVBAR */}
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[85px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#004D4D] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="font-black text-lg sm:text-2xl text-slate-800">
              LPD
            </h1>

            <p className="hidden sm:block text-xs text-slate-500">
              Layanan Pengaduan Masyarakat Depok
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="hidden sm:flex px-6 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-[#004D4D] hover:bg-[#006666] text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition"
          >
            Mulai
          </Link>
        </div>
      </div>
    </header>

    {/* HERO */}
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#DFF6F3] text-[#004D4D] px-4 py-2 sm:px-5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm mb-6 sm:mb-8">
            <CheckCircle2 size={18} />
            Platform Pengaduan Masyarakat Modern
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-black text-slate-800">
            Suarakan
            <span className="text-[#004D4D]">
              {" "}
              Keluhan Warga{" "}
            </span>
            Secara Cepat & Transparan
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-500 leading-relaxed mt-6 sm:mt-8 max-w-2xl">
            Laporkan jalan rusak, sampah, banjir, lampu mati,
            dan berbagai masalah lingkungan sekitar dengan
            sistem thread interaktif modern.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10">
            <Link
              href="/register"
              className="bg-[#004D4D] hover:bg-[#006666] text-white px-6 py-4 rounded-2xl font-bold text-base sm:text-lg transition flex items-center justify-center gap-3"
            >
              Buat Laporan
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/login"
              className="bg-white border border-slate-200 hover:border-[#004D4D] px-6 py-4 rounded-2xl font-bold text-base sm:text-lg text-slate-700 transition text-center"
            >
              Masuk Dashboard
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 sm:mt-16">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100"
              >
                <h2 className="text-3xl sm:text-4xl font-black text-[#004D4D]">
                  {item.number}
                </h2>

                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute -top-10 -right-10 w-56 sm:w-72 h-56 sm:h-72 bg-[#DFF6F3] rounded-full blur-3xl opacity-70" />

          <div className="relative bg-white rounded-[28px] sm:rounded-[40px] p-4 sm:p-8 shadow-2xl border border-slate-100">
            <div className="border border-slate-100 rounded-[24px] sm:rounded-[32px] overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DFF6F3] flex items-center justify-center text-xl sm:text-2xl">
                    👤
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Warga Depok
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <MapPin size={14} />
                      Jalan Margonda Raya
                    </div>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-6 leading-snug">
                  Jalan berlubang membahayakan pengendara
                </h2>

                <p className="text-slate-600 leading-relaxed mt-4">
                  Kondisi jalan rusak sudah cukup lama dan
                  menyebabkan beberapa pengendara jatuh saat
                  hujan.
                </p>

                <div className="mt-6 bg-[#F4F7F6] rounded-3xl h-[180px] sm:h-[260px] flex items-center justify-center text-6xl sm:text-7xl">
                  🛣️
                </div>
              </div>

              <div className="border-t border-slate-100 px-5 sm:px-6 py-4 flex flex-wrap gap-5 text-slate-500 text-sm">
                <div>❤️ 124</div>
                <div>💬 32</div>
                <div>🔄 Dibagikan</div>
              </div>
            </div>

            <div className="hidden md:block absolute -bottom-8 -left-8 bg-[#004D4D] text-white rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <Users size={28} />

                <div>
                  <h3 className="font-black text-2xl">
                    3.248
                  </h3>

                  <p className="text-white/70 text-sm">
                    Warga Aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
            Kenapa Menggunakan LPD?
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-slate-500 mt-6 leading-relaxed">
            Sistem pengaduan masyarakat modern dengan pengalaman
            seperti media sosial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 sm:mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#DFF6F3] flex items-center justify-center text-[#004D4D] mb-6">
                  <Icon size={34} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {feature.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mt-4">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[28px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-[180px] sm:text-[250px] font-black">
          L
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Mari Bangun Lingkungan
            <br />
            yang Lebih Baik Bersama
          </h2>

          <p className="text-white/70 text-base sm:text-lg lg:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            Satu laporan dari Anda dapat membantu banyak warga
            lainnya.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              href="/register"
              className="bg-white text-[#004D4D] hover:bg-slate-100 px-8 py-4 rounded-2xl font-black text-lg transition"
            >
              Daftar Sekarang
            </Link>

            <Link
              href="/login"
              className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-2xl font-black text-lg transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>
)
}