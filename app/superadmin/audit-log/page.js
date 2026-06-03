"use client"

import { useEffect, useState } from "react"

import NavbarSuperAdmin from "@/components/NavbarSuperAdmin"

import {
  ShieldCheck,
  Clock3,
  Search,
  User,
  FolderKanban,
  FileText,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react"
import api from "@/lib/api"

export default function AuditLogPage() {

  const [logs, setLogs] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState("")

  async function fetchLogs() {

    try {

      const token =
        localStorage.getItem("token")

      const response =
        await api.get(
          "/audit-logs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      setLogs(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    const loadLogs =
      async () => {

      await fetchLogs()
    }

    loadLogs()

  }, [])

  const filteredLogs =
    logs.filter((item) =>

      item.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      item.action
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  const getActionIcon =
    (action) => {

    if (
      action?.includes("create")
    ) {
      return (
        <Plus size={22} />
      )
    }

    if (
      action?.includes("update")
    ) {
      return (
        <Pencil size={22} />
      )
    }

    if (
      action?.includes("delete")
    ) {
      return (
        <Trash2 size={22} />
      )
    }

    if (
      action?.includes("report")
    ) {
      return (
        <FileText size={22} />
      )
    }

    return (
      <FolderKanban size={22} />
    )
  }

  const getActionColor =
    (action) => {

    if (
      action?.includes("create")
    ) {
      return (
        "bg-green-100 text-green-700"
      )
    }

    if (
      action?.includes("update")
    ) {
      return (
        "bg-yellow-100 text-yellow-700"
      )
    }

    if (
      action?.includes("delete")
    ) {
      return (
        "bg-red-100 text-red-700"
      )
    }

    return (
      "bg-blue-100 text-blue-700"
    )
  }

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
            Audit Log
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Riwayat seluruh aktivitas sistem
          </p>

        </div>

        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white/15 flex items-center justify-center">

          <ShieldCheck size={42} />

        </div>

      </div>

    </div>

    {/* SEARCH */}
    <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-sm border border-slate-100 mb-6 lg:mb-10">

      <div className="relative">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari aktivitas..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-slate-200 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-[#004D4D]"
        />

      </div>

    </div>

    {/* LOG LIST */}
    <div className="space-y-5 lg:space-y-6">

      {filteredLogs.length === 0 ? (

        <div className="bg-white rounded-[32px] p-10 lg:p-16 text-center shadow-sm border border-slate-100">

          <div className="text-7xl mb-4">
            📜
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-700">
            Audit Log Kosong
          </h2>

        </div>

      ) : (

        filteredLogs.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100"
          >

            <div className="flex flex-col lg:flex-row lg:items-start gap-5">

              <div
                className={`w-14 h-14 lg:w-16 lg:h-16 rounded-3xl flex items-center justify-center shrink-0 ${getActionColor(
                  item.action
                )}`}
              >

                {getActionIcon(
                  item.action
                )}

              </div>

              <div className="flex-1">

                <h2 className="text-xl lg:text-2xl font-black text-slate-800 break-words">

                  {item.action}

                </h2>

                <p className="text-slate-500 mt-3 leading-relaxed break-words">

                  {item.description}

                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 mt-5">

                  <div className="flex items-center gap-2 text-slate-600">

                    <User size={16} />

                    <span className="break-all">
                      {item.username}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-slate-600">

                    <Clock3 size={16} />

                    {new Date(
                      item.created_at
                    ).toLocaleString("id-ID")}

                  </div>

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

