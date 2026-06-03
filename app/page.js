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
    <div className="min-h-screen bg-[#F4F7F6] overflow-hidden">
      {/* NAVBAR */}
      <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-[85px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#004D4D] flex items-center justify-center text-white font-black text-xl">
              <Image src="/logo.png" alt="Logo" width={48} height={24} className="object-contain"/>
            </div>

            <div>
              <h1 className="font-black text-2xl text-slate-800">
                LPD
              </h1>

              <p className="text-xs text-slate-500">
                Layanan Pengaduan Masyarakat Depok
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-[#004D4D] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-semibold transition"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-[150px] pb-24 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#DFF6F3] text-[#004D4D] px-5 py-3 rounded-full font-semibold mb-8">
              <CheckCircle2 size={18} />
              Platform Pengaduan Masyarakat Modern
            </div>

            <h1 className="text-6xl leading-[1.1] font-black text-slate-800">
              Suarakan
              <span className="text-[#004D4D]">
                {" "}
                Keluhan Warga{" "}
              </span>
              Secara Cepat & Transparan
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed mt-8 max-w-2xl">
              Laporkan jalan rusak, sampah, banjir, lampu mati,
              dan berbagai masalah lingkungan sekitar dengan
              sistem thread interaktif modern.
            </p>

            <div className="flex items-center gap-5 mt-10 flex-wrap">
              <Link
                href="/register"
                className="bg-[#004D4D] hover:bg-[#006666] text-white px-8 py-5 rounded-3xl font-bold text-lg transition flex items-center gap-3"
              >
                Buat Laporan
                <ArrowRight size={22} />
              </Link>

              <Link
                href="/login"
                className="bg-white border border-slate-200 hover:border-[#004D4D] px-8 py-5 rounded-3xl font-bold text-lg text-slate-700 transition"
              >
                Masuk Dashboard
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-5 mt-16">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                  <h2 className="text-4xl font-black text-[#004D4D]">
                    {item.number}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#DFF6F3] rounded-full blur-3xl opacity-70" />

            <div className="relative bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
              {/* THREAD CARD */}
              <div className="border border-slate-100 rounded-[32px] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#DFF6F3] flex items-center justify-center text-2xl">
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

                  <h2 className="text-2xl font-black text-slate-800 mt-6 leading-snug">
                    Jalan berlubang membahayakan pengendara
                  </h2>

                  <p className="text-slate-600 leading-relaxed mt-4">
                    Kondisi jalan rusak sudah cukup lama dan
                    menyebabkan beberapa pengendara jatuh saat
                    hujan.
                  </p>

                  <div className="mt-6 bg-[#F4F7F6] rounded-3xl h-[260px] flex items-center justify-center text-7xl">
                    🛣️
                  </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-5 flex items-center gap-8 text-slate-500">
                  <div className="flex items-center gap-2">
                    ❤️ 124
                  </div>

                  <div className="flex items-center gap-2">
                    💬 32
                  </div>

                  <div className="flex items-center gap-2">
                    🔄 Dibagikan
                  </div>
                </div>
              </div>

              {/* FLOAT CARD */}
              <div className="absolute -bottom-10 -left-10 bg-[#004D4D] text-white rounded-3xl p-6 shadow-2xl">
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
      <section className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-slate-800 leading-tight">
              Kenapa Menggunakan LPD?
            </h2>

            <p className="text-slate-500 text-xl mt-6 leading-relaxed">
              Sistem pengaduan masyarakat modern dengan
              pengalaman seperti media sosial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div
                  key={index}
                  className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#DFF6F3] flex items-center justify-center text-[#004D4D] mb-8">
                    <Icon size={38} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800">
                    {feature.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed mt-4 text-lg">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[40px] p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 text-[250px] font-black">
            L
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl font-black leading-tight">
              Mari Bangun Lingkungan
              <br />
              yang Lebih Baik Bersama
            </h2>

            <p className="text-white/70 text-xl mt-8 max-w-3xl mx-auto leading-relaxed">
              Satu laporan dari Anda dapat membantu banyak
              warga lainnya.
            </p>

            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <Link
                href="/register"
                className="bg-white text-[#004D4D] hover:bg-slate-100 px-8 py-5 rounded-3xl font-black text-lg transition"
              >
                Daftar Sekarang
              </Link>

              <Link
                href="/login"
                className="border border-white/20 hover:bg-white/10 px-8 py-5 rounded-3xl font-black text-lg transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}