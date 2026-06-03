"use client"

import { useEffect, useState } from "react"

import * as Icons from "lucide-react"

import NavbarSuperAdmin from "@/components/NavbarSuperAdmin"

import {
  Clock3,
  FolderKanban,
} from "lucide-react"
import api from "@/lib/api"

export default function CategoryRequestsPage() {

  const [iconSearch, setIconSearch] = useState("")

  const [requests, setRequests] =
    useState([])

  const [categories, setCategories] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [selectedIcons,
    setSelectedIcons] = useState({})

  const iconOptions =
    Object.keys(Icons)

  const [openIconPicker, setOpenIconPicker] =
  useState({})


  async function fetchRequests() {

    try {

      const token =
        localStorage.getItem("token")

      const [
        requestsResponse,
        categoriesResponse,
      ] = await Promise.all([

        api.get(
          "/category-requests",
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


      const pendingRequests =
        requestsResponse.data.filter(
          (item) =>
            item.status === "pending"
        )

      setRequests(pendingRequests)

      setCategories(
        categoriesResponse.data
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    const loadRequests =
      async () => {

      await fetchRequests()
    }

    loadRequests()

  }, [])

  const handleApprove =
    async (id) => {

    try {

      const token =
        localStorage.getItem("token")

      await api.put(
        `/category-requests/approve/${id}`,
        {
          icon:
            selectedIcons[id]
            || "FolderKanban",
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )


      setRequests(
        requests.filter(
          (item) => item.id !== id
        )
      )

      await fetchRequests()

      alert(
        "Request berhasil diapprove"
      )

    } catch (error) {

      console.log(error)

      alert(
        "Gagal approve request"
      )
    }
  }

  const handleReject =
    async (id) => {

    try {

      const token =
        localStorage.getItem("token")

      await api.put(
        `/category-requests/reject/${id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )


      setRequests(
        requests.filter(
          (item) => item.id !== id
        )
      )

      alert(
        "Request berhasil ditolak"
      )

    } catch (error) {

      console.log(error)

      alert(
        "Gagal reject request"
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
  <div className="overflow-x-hidden">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl mb-6 lg:mb-10">

      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">

        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/15 flex items-center justify-center">

          <FolderKanban size={40} />

        </div>

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Kelola Kategori
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Approval kategori dari admin
          </p>

        </div>

      </div>

    </div>

    {/* REQUEST LIST */}
    <div className="space-y-5 lg:space-y-6">

      {requests.length === 0 ? (

        <div className="bg-white rounded-[32px] p-10 lg:p-16 text-center shadow-sm border border-slate-100">

          <div className="text-7xl mb-5">
            📂
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-700">
            Tidak Ada Request Pending
          </h2>

        </div>

      ) : (

        requests.map((item) => {

          const PreviewIcon =
            Icons[
              selectedIcons[item.id]
            ] || FolderKanban

          return (

            <div
              key={item.id}
              className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100"
            >

              <div className="flex flex-col xl:flex-row xl:justify-between gap-6">

                {/* LEFT */}
                <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">

                  <div className="w-16 h-16 rounded-3xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center shrink-0">

                    <PreviewIcon size={30} />

                  </div>

                  <div>

                    <h2 className="text-xl lg:text-2xl font-black text-slate-800">

                      {item.nama_kategori}

                    </h2>

                    <p className="text-slate-500 mt-2">

                      Request oleh{" "}
                      <span className="font-bold">
                        {item.username}
                      </span>

                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">

                      <span
                        className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${
                          item.action_type === "delete"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {item.action_type}

                      </span>

                      <span className="px-4 py-2 rounded-2xl bg-yellow-100 text-yellow-700 text-sm font-bold flex items-center gap-2">

                        <Clock3 size={16} />

                        Pending

                      </span>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="w-full xl:w-[300px] flex flex-col gap-4">

                  {item.action_type !== "delete" && (

                    <div className="border border-slate-200 rounded-3xl p-4 bg-slate-50">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenIconPicker({
                            ...openIconPicker,
                            [item.id]:
                              !openIconPicker[item.id],
                          })
                        }
                        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-4 hover:border-[#004D4D] transition"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-2xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center">

                            <PreviewIcon size={22} />

                          </div>

                          <div className="text-left">

                            <p className="text-xs text-slate-400 font-semibold">
                              Icon Kategori
                            </p>

                            <p className="font-bold text-slate-700">
                              {selectedIcons[item.id] ||
                                "FolderKanban"}
                            </p>

                          </div>

                        </div>

                        <Icons.ChevronDown
                          size={20}
                          className={`transition ${
                            openIconPicker[item.id]
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                      </button>

                      {openIconPicker[item.id] && (

                        <div className="mt-4">

                          <input
                            type="text"
                            placeholder="Cari icon..."
                            onChange={(e) =>
                              setIconSearch(
                                e.target.value
                              )
                            }
                            className="w-full border border-slate-200 rounded-2xl px-4 py-3 mb-4 outline-none focus:border-[#004D4D]"
                          />

                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2">

                            {iconOptions
                              .filter((icon) =>
                                icon
                                  .toLowerCase()
                                  .includes(
                                    iconSearch.toLowerCase()
                                  )
                              )
                              .slice(0, 120)
                              .map((icon) => {

                                const IconComponent =
                                  Icons[icon]

                                return (

                                  <button
                                    key={icon}
                                    type="button"
                                    title={icon}
                                    onClick={() => {

                                      setSelectedIcons({
                                        ...selectedIcons,
                                        [item.id]: icon,
                                      })

                                      setOpenIconPicker({
                                        ...openIconPicker,
                                        [item.id]: false,
                                      })

                                    }}
                                    className={`h-14 rounded-2xl border flex items-center justify-center transition ${
                                      selectedIcons[item.id] === icon
                                        ? "bg-[#004D4D] text-white border-[#004D4D]"
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                    }`}
                                  >

                                    <IconComponent size={20} />

                                  </button>

                                )
                              })}

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                  <button
                    onClick={() =>
                      handleApprove(item.id)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 font-bold transition"
                  >

                    Approve

                  </button>

                  <button
                    onClick={() =>
                      handleReject(item.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl py-4 font-bold transition"
                  >

                    Reject

                  </button>

                </div>

              </div>

            </div>

          )
        })
      )}

    </div>

    {/* ACTIVE CATEGORIES */}
    <div className="mt-10 lg:mt-14">

      <div className="mb-8">

        <h2 className="text-2xl lg:text-3xl font-black text-slate-800">
          Semua Kategori
        </h2>

        <p className="text-slate-500 mt-2">
          Kategori aktif dalam sistem
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

        {categories.map((item) => {

          const CategoryIcon =
            Icons[item.icon]
            || FolderKanban

          return (

            <div
              key={item.id}
              className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100 hover:shadow-lg transition"
            >

              <div className="flex items-center gap-5">

                <div className="w-16 h-16 rounded-3xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center shrink-0">

                  <CategoryIcon size={30} />

                </div>

                <div>

                  <h3 className="text-lg lg:text-xl font-black text-slate-800">

                    {item.nama_kategori}

                  </h3>

                  <p className="text-slate-500 mt-1 break-all">

                    {item.icon || "FolderKanban"}

                  </p>

                </div>

              </div>

            </div>

          )
        })}

      </div>

    </div>

  </div>
)
}

