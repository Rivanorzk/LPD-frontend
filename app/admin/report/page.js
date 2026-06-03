"use client"

import { useEffect, useState } from "react"

import {
  FileText,
  Search,
  MapPin,
  MessageCircle,
  Heart,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

import { useRouter } from "next/navigation"
import NavbarAdmin from "@/components/NavbarAdmin"
import api from "@/lib/api"

export default function ReportPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua")
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
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

       const filteredData = response.data
        .filter(
          (item) =>
            item.status !==
            "Menunggu"
        )
        .sort(
          (a, b) =>
            new Date(b.verified_at || 0) -
            new Date(a.verified_at || 0)
        )

      setReports(filteredData)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = reports.filter(
  (item) => {
    const matchStatus =
      statusFilter === "Semua" ||
      item.status?.toLowerCase() ===
        statusFilter.toLowerCase()

    const matchSearch =
      item.header
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.username
        ?.toLowerCase()
        .includes(search.toLowerCase())

    return matchStatus && matchSearch
  }
)

  const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {

    case "menunggu":
      return "bg-blue-100 text-blue-700"

    case "dalam proses":
      return "bg-yellow-100 text-yellow-700"

    case "selesai":
      return "bg-green-100 text-green-700"

    case "ditolak":
      return "bg-red-100 text-red-700"

    default:
      return "bg-slate-100 text-slate-700"
  }
}

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        )

      case "Dalam Proses":
      case "dalam proses":
        return (
          <Clock3
            size={18}
            className="text-yellow-600"
          />
        )

      default:
        return (
          <AlertTriangle
            size={18}
            className="text-red-500"
          />
        )
    }
  }

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[500px] rounded-[32px] animate-pulse" />
    </div>
  )
}

  return (
  <div>

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl">

      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-5">

        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/15 flex items-center justify-center">
          <FileText size={40} />
        </div>

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Manajemen Laporan
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Monitor dan kelola semua laporan masyarakat
          </p>

        </div>

      </div>

    </div>

    {/* FILTER */}
    <div className="bg-white rounded-[32px] p-4 sm:p-6 mt-6 lg:mt-10 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      {/* SEARCH */}
      <div className="relative w-full lg:w-[350px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari laporan..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
        />

      </div>

      {/* FILTER STATUS */}
      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value)
        }
        className="w-full lg:w-auto px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
      >

        <option>Semua</option>
        <option>Dalam Proses</option>
        <option>Selesai</option>
        <option>Ditolak</option>

      </select>

    </div>

    {/* REPORT LIST */}
    <div className="mt-6 lg:mt-10 grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-8">

      {filteredReports.length === 0 ? (

        <div className="col-span-full bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 lg:p-20 flex flex-col items-center justify-center text-center">

          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#DFF6F3] flex items-center justify-center text-5xl lg:text-6xl mb-8">
            📭
          </div>

          <h2 className="text-2xl lg:text-4xl font-black text-slate-800">
            Tidak Ada Laporan
          </h2>

          <p className="text-slate-500 mt-4 text-base lg:text-lg max-w-md leading-relaxed">
            Belum ada laporan yang sesuai dengan pencarian atau filter yang dipilih.
          </p>

        </div>

      ) : (

        filteredReports.map((report) => (

          <div
            key={report.id}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition flex flex-col"
          >

            {/* IMAGE */}
            {report.image && (

              <img
                src={report.image}
                alt={report.header}
                className="w-full h-[180px] sm:h-[220px] object-cover"
              />

            )}

            <div className="p-5 flex flex-col flex-1">

              {/* TOP */}
              <div className="flex flex-col gap-5">

                <div className="flex items-center justify-between flex-wrap gap-3">

                  <div className="flex items-center gap-3">

                    {getStatusIcon(
                      report.status
                    )}

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        report.status
                      )}`}
                    >

                      {report.status ||
                        "Menunggu"}

                    </span>

                  </div>

                  <div className="bg-[#DFF6F3] text-[#004D4D] px-4 py-2 rounded-2xl font-semibold text-sm">

                    {report.nama_kategori}

                  </div>

                </div>

                <h2 className="text-2xl lg:text-3xl font-black text-slate-800 line-clamp-2">
                  {report.header}
                </h2>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-slate-500">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#DFF6F3] flex items-center justify-center shrink-0">

                      {report?.profile_image ? (

                        <img
                          src={report.profile_image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />

                      ) : (
                        "👤"
                      )}

                    </div>

                    <span className="font-medium text-slate-700">
                      {report.username}
                    </span>

                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {report.location}
                  </div>

                </div>

              </div>

              {/* BODY */}
              <p className="text-slate-600 leading-relaxed mt-6 line-clamp-3">
                {report.body}
              </p>

              {/* FOOTER */}
              <div className="mt-auto pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                <div className="flex items-center gap-6 text-slate-500">

                  <div className="flex items-center gap-2">
                    <Heart size={18} />
                    {report.total_likes || 0}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    {report.total_comments || 0}
                  </div>

                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/admin/report/${report.id}`
                    )
                  }
                  className="w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-semibold transition"
                >

                  Lihat Detail

                </button>

              </div>

            </div>

          </div>

        ))

      )}

    </div>

  </div>
)
}