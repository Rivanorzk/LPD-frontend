"use client"

import { useEffect, useState } from "react"

import {
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Search,
  MapPin,
  Eye,
  XCircle,
  Download,
} from "lucide-react"
import api from "@/lib/api"

export default function ReportsPage() {

  const [reports, setReports] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState("")

  const [selectedReport,
    setSelectedReport] =
    useState(null)

  async function fetchReports() {

    try {

      const token =
        localStorage.getItem("token")

      const response =
        await api.get(
          "/report",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      setReports(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  const handlePDF = async (id) => {
  try {
    const token = localStorage.getItem("token")

    const response = await api.get(
      `/report/pdf/${id}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    )

    const link =
      document.createElement("a")

    link.href = url
    link.download = `laporan-${id}.pdf`

    document.body.appendChild(link)

    link.click()

    link.remove()

    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.log(error)
    alert("Gagal download PDF")
  }
}

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    const loadReports =
      async () => {

      await fetchReports()
    }

    loadReports()

  }, [])

  const filteredReports =
    reports.filter((item) =>
      item.header
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  const pendingReports =
    reports.filter(
      (item) =>
        item.status === "Menunggu"
    ).length

  const processReports =
    reports.filter(
      (item) =>
        item.status ===
        "Dalam Proses"
    ).length

  const completedReports =
    reports.filter(
      (item) =>
        item.status === "Selesai"
    ).length

  const rejectedReports =
    reports.filter(
      (item) =>
        item.status === "Ditolak"
    ).length

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[500px] rounded-[32px] animate-pulse" />
    </div>
  )
}

  return (
  <div className="overflow-x-hidden">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl mb-6 lg:mb-10">

      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5 text-center sm:text-left">

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Semua Laporan
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Monitoring seluruh laporan masyarakat
          </p>

        </div>

        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white/15 flex items-center justify-center">

          <FileText size={42} />

        </div>

      </div>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 mb-6 lg:mb-10">

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Menunggu
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">
              {pendingReports}
            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">

            <AlertTriangle size={28} />

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Diproses
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">
              {processReports}
            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">

            <Clock3 size={28} />

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Selesai
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">
              {completedReports}
            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">

            <CheckCircle2 size={28} />

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Ditolak
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">
              {rejectedReports}
            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">

            <XCircle size={28} />

          </div>

        </div>

      </div>

    </div>

    {/* TABLE */}
    <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-xl lg:text-2xl font-black text-slate-800">
            Data Laporan
          </h2>

          <p className="text-slate-500 mt-2">
            Semua laporan masyarakat
          </p>

        </div>

        <div className="relative w-full lg:w-[320px]">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-slate-200 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-[#004D4D]"
          />

        </div>

      </div>

      {/* MOBILE CARD */}
      <div className="lg:hidden space-y-4">

        {filteredReports.map((item) => (

          <div
            key={item.id}
            className="border border-slate-100 rounded-3xl p-5"
          >

            <h3 className="font-bold text-slate-800">
              {item.header}
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              {item.username}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">

              <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                item.status === "Menunggu"
                  ? "bg-blue-100 text-blue-700"
                  : item.status === "Dalam Proses"
                  ? "bg-yellow-100 text-yellow-700"
                  : item.status === "Selesai"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {item.status}
              </span>

            </div>

            <div className="flex items-start gap-2 mt-4 text-slate-600">

              <MapPin size={16} className="mt-1 shrink-0" />

              <p className="text-sm">
                {item.location || "-"}
              </p>

            </div>

            <div className="flex gap-3 mt-5">

              <button
                onClick={() =>
                  setSelectedReport(item)
                }
                className="flex-1 h-12 rounded-2xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center"
              >

                <Eye size={18} />

              </button>

              <button
                onClick={() =>
                  handlePDF(item.id)
                }
                className="flex-1 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center"
              >

                <Download size={18} />

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-100 text-left">

              <th className="pb-5 text-slate-500 w-[32%]">
                Judul
              </th>

              <th className="pb-5 text-slate-500 w-[14%]">
                Pelapor
              </th>

              <th className="pb-5 text-slate-500 w-[16%]">
                Status
              </th>

              <th className="pb-5 text-slate-500 w-[28%]">
                Lokasi
              </th>

              <th className="pb-5 text-slate-500 w-[10%]">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredReports.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-100"
              >

                <td className="py-6">

                  <div>

                    <h3 className="font-bold text-slate-800">

                      {item.header}

                    </h3>

                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">

                      {item.body}

                    </p>

                  </div>

                </td>

                <td className="py-6 font-semibold text-slate-700">

                  {item.username}

                </td>

                <td className="py-6">

                  <span className={`
                    px-4 py-2 rounded-2xl text-sm font-bold

                    ${item.status === "Menunggu"
                      ? "bg-blue-100 text-blue-700"
                      : ""}

                    ${item.status === "Dalam Proses"
                      ? "bg-yellow-100 text-yellow-700"
                      : ""}

                    ${item.status === "Selesai"
                      ? "bg-green-100 text-green-700"
                      : ""}

                    ${item.status === "Ditolak"
                      ? "bg-red-100 text-red-700"
                      : ""}
                  `}>

                    {item.status}

                  </span>

                </td>

                <td className="py-6 max-w-[240px]">

                  <div className="flex items-start gap-2 text-slate-600">

                    <MapPin
                      size={16}
                      className="mt-1 shrink-0"
                    />

                    <p className="line-clamp-2 break-words text-sm leading-relaxed">

                      {item.location || "-"}

                    </p>

                  </div>

                </td>

                <td className="py-6">

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        setSelectedReport(item)
                      }
                      className="w-12 h-12 rounded-2xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center hover:bg-[#004D4D] hover:text-white transition"
                    >

                      <Eye size={20} />

                    </button>

                    <button
                      onClick={() =>
                        handlePDF(item.id)
                      }
                      className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                    >

                      <Download size={20} />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredReports.length === 0 && (

          <div className="text-center py-16">

            <div className="text-7xl mb-4">
              📄
            </div>

            <h3 className="text-2xl font-black text-slate-700">

              Laporan Tidak Ditemukan

            </h3>

          </div>

        )}

      </div>
    </div>

    {/* MODAL */}
    {selectedReport && (

      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

        <div className="bg-white w-full max-w-3xl rounded-[32px] p-5 lg:p-8 relative overflow-y-auto max-h-[90vh]">

          <button
            onClick={() =>
              setSelectedReport(null)
            }
            className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"
          >

            <XCircle size={22} />

          </button>

          <div className="mb-8">

            <h2 className="text-2xl lg:text-4xl font-black text-slate-800 pr-12">

              {selectedReport.header}

            </h2>

            <p className="text-slate-500 mt-3">

              {selectedReport.username}

            </p>

          </div>

          {selectedReport.image && (

            <img
              src={selectedReport.image}
              alt="report"
              className="w-full h-[220px] lg:h-[350px] object-cover rounded-[28px] mb-8"
            />

          )}

          <div className="space-y-6">

            <div>

              <h3 className="font-black text-slate-800 mb-2">
                Deskripsi
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {selectedReport.body}
              </p>

            </div>

            <div>

              <h3 className="font-black text-slate-800 mb-2">
                Lokasi
              </h3>

              <p className="text-slate-600">
                {selectedReport.location || "-"}
              </p>

            </div>

            <div>

              <h3 className="font-black text-slate-800 mb-2">
                Status
              </h3>

              <p className="text-slate-600">
                {selectedReport.status}
              </p>

            </div>

          </div>

        </div>

      </div>

    )}

  </div>
)
}