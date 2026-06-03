"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

import {
  FileText,
  Heart,
  MessageCircle,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function ActivityPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token")

        const reportResponse = await api.get("/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userResponse = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userReports = reportResponse.data.filter(
          (item) => item.user_id === userResponse.data.id
        )

        setActivities(userReports)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return <CheckCircle2 className="text-green-600" />

      case "dalam proses":
        return <Clock3 className="text-yellow-600" />

      default:
        return <AlertCircle className="text-blue-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-700"

      case "dalam proses":
        return "bg-yellow-100 text-yellow-700"

      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  if (loading) {
    return (
      <div className="bg-white h-[500px] rounded-[32px] animate-pulse" />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-6 lg:p-10 text-white shadow-lg">
        <h1 className="text-3xl lg:text-5xl font-black">
          Aktivitas Saya
        </h1>

        <p className="mt-4 text-white/80 text-base lg:text-lg">
          Riwayat aktivitas dan laporan Anda.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-[#004D4D]">
            <FileText />
            <span className="font-semibold">Total Laporan</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-5">
            {activities.length}
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-red-500">
            <Heart />
            <span className="font-semibold">Total Likes</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-5">
            {activities.reduce(
              (acc, item) => acc + Number(item.total_likes || 0),
              0
            )}
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-teal-600">
            <MessageCircle />
            <span className="font-semibold">Komentar</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-5">
            {activities.reduce(
              (acc, item) => acc + Number(item.total_comments || 0),
              0
            )}
          </h2>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 text-yellow-600">
            <Clock3 />
            <span className="font-semibold">Dalam Proses</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-5">
            {
              activities.filter(
                (item) =>
                  item.status?.toLowerCase() === "dalam proses"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="mt-10 space-y-6">
        {activities.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
              <div className="flex gap-4 lg:gap-5">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#DFF6F3] flex items-center justify-center shrink-0">
                  {getStatusIcon(item.status)}
                </div>

                <div>
                  <h2 className="text-lg lg:text-2xl font-bold text-slate-800">
                    {item.header}
                  </h2>

                  <p className="text-slate-500 mt-3 leading-relaxed">
                    {item.body?.slice(0, 120)}...
                  </p>

                  <div className="flex flex-wrap gap-3 lg:gap-5 mt-5 text-sm text-slate-500">
                    <span>📍 {item.location}</span>
                    <span>❤️ {item.total_likes || 0} Likes</span>
                    <span>💬 {item.total_comments || 0} Komentar</span>
                    <span>
                      🕒{" "}
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`px-4 lg:px-5 py-2 lg:py-3 rounded-full font-semibold text-sm h-fit ${getStatusColor(item.status)}`}>
                {item.status || "Menunggu"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}