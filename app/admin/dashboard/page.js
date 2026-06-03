"use client"

import NavbarAdmin from "@/components/NavbarAdmin"
import api from "@/lib/api"
import {
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Circle,
  CircleX,
} from "lucide-react"

import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [reports, setReports] = useState([])
const [loading, setLoading] = useState(true)

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

      setReports(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  fetchReports()
}, [])

const totalReports = reports.length

const processedReports = reports.filter(
  (item) =>
    item.status?.toLowerCase() ===
    "dalam proses"
).length

const completedReports = reports.filter(
  (item) =>
    item.status?.toLowerCase() ===
    "selesai"
).length

const pendingReports = reports.filter(
  (item) =>
    item.status?.toLowerCase() ===
    "menunggu"
).length

const rejectedReports = reports.filter(
  (item) =>
    item.status?.toLowerCase() ===
    "ditolak"
).length

const stats = [
  {
    title: "Total Laporan",
    value: totalReports,
    icon: FileText,
    color: "",
  },
  {
    title: "Menunggu",
    value: pendingReports,
    icon: AlertTriangle,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Diproses",
    value: processedReports,
    icon: Clock3,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Selesai",
    value: completedReports,
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Ditolak",
    value: rejectedReports,
    icon: CircleX,
    color: "bg-red-100 text-red-700",
  },
]

if (loading) {
  return (
    <div>
      <div className="bg-white h-[400px] rounded-[32px] animate-pulse" />
    </div>
  )
}

  return (
  <div>

    <div>
      <h1 className="text-3xl lg:text-4xl font-black text-slate-800">
        Dashboard Admin
      </h1>

      <p className="text-slate-500 mt-3 text-base lg:text-lg">
        Monitoring laporan masyarakat Kota Depok.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-10">

      {stats.map((item, index) => {

        const Icon =
          item.icon

        return (
          <div
            key={index}
            className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm line-clamp-1">
                  {item.title}
                </p>

                <h2 className="text-4xl font-black text-slate-800 mt-3">
                  {item.value}
                </h2>

              </div>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
              >

                <Icon size={30} />

              </div>

            </div>

          </div>
        )
      })}

    </div>

    <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100 mt-10">

      <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-6">
        Aktivitas Terbaru
      </h2>

      <div className="space-y-5">

        {reports.slice(0, 5).map((item) => (

          <div
            key={item.id}
            className="border border-slate-100 bg-[#FAFAFA] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >

            <div>

              <h3 className="font-bold text-slate-800">
                {item.header}
              </h3>

              <p className="text-slate-500 mt-1 text-sm">

                {item.username}
                {" • "}

                {new Date(
                  item.created_at
                ).toLocaleString("id-ID")}

              </p>

            </div>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold

                ${
                  item.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Dalam Proses"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.status === "Menunggu"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >

              {item.status}

            </span>

          </div>

        ))}

      </div>

    </div>

  </div>
)
}
