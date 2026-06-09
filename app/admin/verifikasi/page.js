"use client"

import { useEffect, useState } from "react"

import {
  ShieldCheck,
  Clock3,
  XCircle,
  CheckCircle2,
  MapPin,
} from "lucide-react"

import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function VerificationPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()


useEffect(() => {
  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await api.get(
        "/report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const pendingReports =
        response.data.filter(
          (item) =>
            !item.status ||
            item.status ===
              "Menunggu"
        )

      setReports(pendingReports)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  loadReports()
}, [])
  

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const token = localStorage.getItem("token")

      await api.patch(
        `/report/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setReports((prev) =>
        prev.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.log(error)
      alert("Gagal update status")
    }
  }

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[500px] rounded-3xl animate-pulse" />
    </div>
  )
}

  return (
  <div>

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl">

      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-5">

        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/15 flex items-center justify-center">
          <ShieldCheck size={40} />
        </div>

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Verifikasi Laporan
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Periksa dan validasi laporan masyarakat
          </p>

        </div>

      </div>

    </div>

    {/* CONTENT */}
    <div className="mt-6 lg:mt-10 space-y-6 lg:space-y-8">

      {reports.length === 0 ? (

        <div className="bg-white rounded-[32px] p-10 lg:p-20 text-center border border-slate-100 shadow-sm">

          <div className="text-7xl lg:text-8xl mb-6">
            ✅
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-800">
            Tidak Ada Laporan Baru
          </h2>

          <p className="text-slate-500 mt-4">
            Semua laporan sudah diverifikasi.
          </p>

        </div>

      ) : (

        reports.map((report) => (

          <div
            key={report.id}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition"
          >

            {/* IMAGE */}
            {report.image && (

              <img
                src={report.image}
                alt={report.header}
                className="w-full h-[220px] sm:h-[280px] lg:h-[300px] object-cover"
              />

            )}

            <div className="p-5 sm:p-6 lg:p-8">

              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <Clock3
                      size={20}
                      className="text-blue-600"
                    />

                    <span className="bg-yellow-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Menunggu
                    </span>

                  </div>

                  <h2 className="text-2xl lg:text-3xl font-black text-slate-800">
                    {report.header}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mt-5 text-slate-500">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-[#DFF6F3] overflow-hidden flex items-center justify-center shrink-0">

                        {report.profile_image ? (
                          <img
                            src={report.profile_image}
                            alt={report.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">👤</span>
                        )}

                      </div>

                      <span>{report.username}</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <MapPin size={16} />

                      {report.location}

                    </div>

                  </div>

                </div>

                <div className="bg-[#DFF6F3] text-[#004D4D] px-5 py-3 rounded-2xl font-semibold self-start">

                  {report.nama_kategori}

                </div>

              </div>

              {/* BODY */}
              <p className="text-slate-600 leading-relaxed mt-6">
                {report.body}
              </p>

              {/* ACTION */}
              <div className="mt-8 lg:mt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <button
                  onClick={() =>
                    router.push(
                      `/admin/report/${report.id}`
                    )
                  }
                  className="w-full lg:w-auto border border-slate-300 hover:bg-slate-100 px-6 py-3 rounded-2xl font-semibold transition"
                >

                  Lihat Detail

                </button>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                  {/* REJECT */}
                  <button
                    onClick={() =>
                      updateStatus(
                        report.id,
                        "Ditolak"
                      )
                    }
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                  >

                    <XCircle size={18} />

                    Tolak

                  </button>

                  {/* APPROVE */}
                  <button
                    onClick={() =>
                      updateStatus(
                        report.id,
                        "Dalam Proses"
                      )
                    }
                    className="w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
                  >

                    <CheckCircle2 size={18} />

                    Verifikasi

                  </button>

                </div>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  </div>
)
}