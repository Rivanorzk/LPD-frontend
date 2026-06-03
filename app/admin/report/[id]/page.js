"use client"

import { useEffect, useState } from "react"

import { useParams, useRouter } from "next/navigation"

import NavbarAdmin from "@/components/NavbarAdmin"

import {
  MapPin,
  Clock3,
  Heart,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react"
import api from "@/lib/api"

export default function AdminReportDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [report, setReport] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token")

        const [reportResponse, commentResponse] =
          await Promise.all([
            api.get(
              `/report/${params.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            api.get(
              `/comment/${params.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ])

        setReport(reportResponse.data)
        setComments(commentResponse.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDetail()
    }
  }, [params.id])

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("token")

      await api.patch(
        `/report/${report.id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setReport((prev) => ({
        ...prev,
        status,
      }))

      alert(`Status diubah menjadi ${status}`)
      if (status === "Selesai") 
      { router.push("/admin/report") }
    } catch (error) {
      console.log(error)
      alert("Gagal update status")
    }
  }

  const handlePDF = async () => {
  try {
    const token = localStorage.getItem("token")

    const response = await api.get(
      `/report/pdf/${params.id}`,
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

    link.download =
      `laporan-${params.id}.pdf`

    document.body.appendChild(link)

    link.click()

    link.remove()

    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.log(error)
    alert("Gagal export PDF")
  }
}

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

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[600px] rounded-[40px] animate-pulse" />
    </div>
  )
}

  return (
  <div>

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl mb-6 lg:mb-10">

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
        Detail Laporan
      </h1>

      <p className="text-white/80 mt-4 text-base lg:text-lg">
        Kelola dan pantau laporan masyarakat
      </p>

    </div>

    {/* CARD */}
    <div className="bg-white rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-sm border border-slate-100">

      {/* IMAGE */}
      {report?.image && (

        <img
          src={report.image}
          alt={report.header}
          className="w-full h-[220px] sm:h-[350px] lg:h-[450px] object-cover"
        />

      )}

      <div className="p-5 sm:p-8 lg:p-10">

        {/* TOP */}
        <div className="flex flex-col gap-6">

          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`px-5 py-3 rounded-full text-sm font-semibold ${getStatusStyle(
                report?.status
              )}`}
            >
              {report?.status || "Menunggu"}
            </span>

            <span className="bg-[#DFF6F3] text-[#004D4D] px-5 py-3 rounded-full text-sm font-semibold">
              {report?.nama_kategori}
            </span>

          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800">
            {report?.header}
          </h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 text-slate-500">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#DFF6F3] flex items-center justify-center shrink-0">

                {report?.profile_image ? (

                  <img
                    src={report?.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (
                  "👤"
                )}

              </div>

              <span className="font-medium">
                {report?.username}
              </span>

            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={16} />
              {new Date(
                report?.created_at
              ).toLocaleString("id-ID")}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {report?.location}
            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="mt-8 lg:mt-10">

          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-5">
            Isi Laporan
          </h2>

          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {report?.body}
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 lg:mt-10">

          <div className="bg-[#F8FAFA] rounded-3xl p-6 border border-slate-100">

            <div className="flex items-center gap-3 text-red-500">
              <Heart size={24} />
              <span className="font-semibold">
                Likes
              </span>
            </div>

            <h2 className="text-4xl font-black mt-4 text-slate-800">
              {report?.total_likes || 0}
            </h2>

          </div>

          <div className="bg-[#F8FAFA] rounded-3xl p-6 border border-slate-100">

            <div className="flex items-center gap-3 text-teal-600">
              <MessageCircle size={24} />
              <span className="font-semibold">
                Komentar
              </span>
            </div>

            <h2 className="text-4xl font-black mt-4 text-slate-800">
              {report?.total_comments || 0}
            </h2>

          </div>

          <div className="bg-[#F8FAFA] rounded-3xl p-6 border border-slate-100">

            <div className="flex items-center gap-3 text-blue-600">
              <AlertTriangle size={24} />
              <span className="font-semibold">
                Status
              </span>
            </div>

            <h2 className="text-xl lg:text-2xl font-black mt-4 text-slate-800">
              {report?.status || "Menunggu"}
            </h2>

          </div>

        </div>

        {/* ACTION */}
        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-4">

          {report?.status === "Menunggu" && (
            <>
              <button
                onClick={() =>
                  updateStatus("Dalam Proses")
                }
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-7 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >

                <CheckCircle2 size={20} />

                Verifikasi

              </button>

              <button
                onClick={() =>
                  updateStatus("Ditolak")
                }
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-7 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >

                <XCircle size={20} />

                Tolak

              </button>
            </>
          )}

          {report?.status === "Dalam Proses" && (

            <button
              onClick={() =>
                updateStatus("Selesai")
              }
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
            >

              <CheckCircle2 size={20} />

              Tandai Selesai

            </button>

          )}

          <button
            onClick={handlePDF}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
          >

            <FileText size={20} />

            Export PDF

          </button>

          <button
            onClick={() =>
              router.back()
            }
            className="w-full sm:w-auto border border-slate-300 hover:bg-slate-100 px-7 py-4 rounded-2xl font-semibold transition"
          >

            Kembali

          </button>

        </div>

      </div>

    </div>

    {/* COMMENTS */}
    <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-sm border border-slate-100 mt-6 lg:mt-10 p-5 sm:p-8 lg:p-10">

      <h2 className="text-2xl lg:text-3xl font-black text-slate-800 mb-8">
        Komentar Masyarakat
      </h2>

      <div className="space-y-6">

        {comments.length === 0 ? (

          <div className="text-center py-16">

            <div className="text-7xl mb-4">
              💬
            </div>

            <h3 className="text-2xl font-bold text-slate-700">
              Belum Ada Komentar
            </h3>

          </div>

        ) : (

          comments.map((item) => (

            <div
              key={item.id}
              className="bg-[#F8FAFA] border border-slate-100 rounded-[32px] p-5 lg:p-6"
            >

              <div className="flex items-start gap-4 lg:gap-5">

                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#DFF6F3] overflow-hidden flex items-center justify-center text-2xl shrink-0">

                  {item?.image ? (

                    <img
                      src={item?.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />

                  ) : (
                    "👤"
                  )}

                </div>

                <div className="flex-1">

                  <h3 className="font-bold text-base lg:text-lg text-slate-800">
                    {item.username}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(
                      item.created_at
                    ).toLocaleString("id-ID")}
                  </p>

                  <p className="text-slate-700 leading-relaxed mt-5 whitespace-pre-line">
                    {item.body}
                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  </div>
)
}