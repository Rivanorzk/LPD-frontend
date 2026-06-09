"use client"

import { useEffect, useState } from "react"

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react"
import api from "@/lib/api"

export default function NotificationPage() {
  const [notifications, setNotifications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

useEffect(() => {

  const fetchNotifications =
    async () => {

      try {

        const token =
          localStorage.getItem("token")

        const response =
          await api.get(
            "/notifications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        setNotifications(response.data)

        await api.patch(
          "/notifications/read",
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        window.dispatchEvent(
            new Event(
              "notifications_changed"
            )
          )

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  fetchNotifications()

}, [])

  const getIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return (
          <CheckCircle2 className="text-green-600" />
        )

      case "dalam proses":
        return (
          <Clock3 className="text-yellow-600" />
        )

      default:
        return (
          <AlertCircle className="text-blue-600" />
        )
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
    <div className="bg-white h-[400px] rounded-[32px] animate-pulse" />
  )
}

  return (
  <div className="max-w-7xl mx-auto">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-6 lg:p-10 text-white shadow-lg">
      <h1 className="text-3xl lg:text-5xl font-black">
        Notifikasi Saya
      </h1>

      <p className="mt-4 text-white/80 text-base lg:text-lg">
        Update terbaru dari laporan yang Anda buat.
      </p>
    </div>

    {/* LIST */}
    <div className="mt-8 lg:mt-10 space-y-5">

      {notifications.length === 0 ? (

        <div className="bg-white rounded-[32px] p-8 lg:p-16 text-center shadow-sm border border-slate-100">

          <div className="text-5xl lg:text-7xl mb-5">
            🔔
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-800">
            Belum Ada Notifikasi
          </h2>

          <p className="text-slate-500 mt-4">
            Semua update laporan Anda akan muncul di sini.
          </p>

        </div>

      ) : (

        notifications.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100 hover:shadow-lg transition"
          >

            <div className="flex gap-4 lg:gap-5">

              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#DFF6F3] flex items-center justify-center shrink-0">
                {getIcon(item.status)}
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">

                  <div>

                    <h2 className="text-lg lg:text-xl font-bold text-slate-800 break-words">
                      {item.title}
                    </h2>

                    <p className="text-slate-500 mt-3 break-words">
                      {item.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">
                        Status laporan:
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>

                  </div>

                  <span className="text-sm text-slate-400 shrink-0">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString(
                      "id-ID"
                    )}
                  </span>

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