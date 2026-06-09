"use client"

import { useEffect, useState } from "react"

import {
  Users,
  ShieldCheck,
  FileText,
  FolderKanban,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import api from "@/lib/api"

export default function SuperAdminDashboard() {

  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const fetchData = async () => {
      try {

        const token =
          localStorage.getItem("token")

        const [
          usersResponse,
          reportsResponse,
          categoriesResponse,
        ] = await Promise.all([

          api.get(
            "/users",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          api.get(
            "/report",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          api.get(
            "/categories"
          ),
        ])

        setUsers(usersResponse.data)
        setReports(reportsResponse.data)
        setCategories(categoriesResponse.data)

      } catch (error) {
        console.log(error)

      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [])

  const totalAdmins =
    users.filter(
      (u) => u.role === "admin"
    ).length

  const totalUsers =
    users.filter(
      (u) => u.role === "user"
    ).length

  const pendingReports =
    reports.filter(
      (r) => r.status === "Menunggu"
    ).length

  const processReports =
    reports.filter(
      (r) =>
        r.status === "Dalam Proses"
    ).length

  const completedReports =
    reports.filter(
      (r) => r.status === "Selesai"
    ).length

  const rejectedReports =
    reports.filter(
      (r) => r.status === "Ditolak"
    ).length

  const stats = [
    {
      title: "Total User",
      value: totalUsers,
      icon: Users,
      color:
        "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Admin",
      value: totalAdmins,
      icon: ShieldCheck,
      color:
        "bg-purple-100 text-purple-700",
    },
    {
      title: "Total Laporan",
      value: reports.length,
      icon: FileText,
      color:
        "bg-green-100 text-green-700",
    },
    {
      title: "Total Kategori",
      value: categories.length,
      icon: FolderKanban,
      color:
        "bg-yellow-100 text-yellow-700",
    },
  ]

  const chartData = [
    {
      name: "Menunggu",
      total: pendingReports,
    },
    {
      name: "Diproses",
      total: processReports,
    },
    {
      name: "Selesai",
      total: completedReports,
    },
    {
      name: "Ditolak",
      total: rejectedReports,
    },
  ]

  const pieData = [
    {
      name: "Menunggu",
      value: pendingReports,
    },
    {
      name: "Diproses",
      value: processReports,
    },
    {
      name: "Selesai",
      value: completedReports,
    },
    {
      name: "Ditolak",
      value: rejectedReports,
    },
  ]

  const COLORS = [
    "#3B82F6",
    "#FACC15",
    "#22C55E",
    "#EF4444",
  ]

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

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
        Dashboard Superadmin
      </h1>

      <p className="text-white/80 mt-4 text-base lg:text-lg">
        Monitoring seluruh sistem pengaduan masyarakat.
      </p>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">

      {stats.map((item, index) => {

        const Icon = item.icon

        return (

          <div
            key={index}
            className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  {item.title}
                </p>

                <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">
                  {item.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${item.color}`}
              >

                <Icon size={28} />

              </div>

            </div>

          </div>

        )
      })}

    </div>

    {/* CHART */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-10">

      {/* BAR CHART */}
      <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100">

        <div className="mb-8">

          <h2 className="text-xl lg:text-2xl font-black text-slate-800">
            Statistik Laporan
          </h2>

          <p className="text-slate-500 mt-2">
            Berdasarkan status laporan.
          </p>

        </div>

        <div className="w-full h-[300px] lg:h-[350px]">

          <ResponsiveContainer>
            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="total"
                radius={[12, 12, 0, 0]}
                fill="#004D4D"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* PIE CHART */}
      <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100">

        <div className="mb-8">

          <h2 className="text-xl lg:text-2xl font-black text-slate-800">
            Distribusi Status
          </h2>

          <p className="text-slate-500 mt-2">
            Persentase laporan masyarakat.
          </p>

        </div>

        <div className="w-full h-[300px] lg:h-[350px]">

          <ResponsiveContainer>
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

    {/* RECENT ACTIVITY */}
    <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100 mt-6 lg:mt-10">

      <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-8">
        Aktivitas Sistem Terbaru
      </h2>

      <div className="space-y-4 lg:space-y-5">

        {reports.slice(0, 5).map((item) => (

          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-100 rounded-2xl p-5"
          >

            <div>

              <h3 className="font-bold text-slate-800">
                {item.header}
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                {item.username} • {item.status}
              </p>

            </div>

            <div>

              {item.status === "Selesai" && (

                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">

                  <CheckCircle2 size={22} />

                </div>

              )}

              {item.status === "Dalam Proses" && (

                <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">

                  <Clock3 size={22} />

                </div>

              )}

              {item.status === "Menunggu" && (

                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">

                  <AlertTriangle size={22} />

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>
)
}

