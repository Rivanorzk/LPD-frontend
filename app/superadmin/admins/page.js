"use client"

import { useEffect, useState, useCallback } from "react"

import NavbarSuperAdmin from "@/components/NavbarSuperAdmin"

import {
  ShieldCheck,
  Search,
  UserPlus,
  Trash2,
  Pencil,
  MessageCircle,
} from "lucide-react"

import { useRouter } from "next/navigation"
import api from "@/lib/api"


export default function ManageAdminPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState(
    {username: "", password: "",}
)
  const router = useRouter()


    const fetchAdmins = useCallback(async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await api.get(
          "/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const filteredAdmins =
          response.data.filter(
            (item) => item.role === "admin"
          )

        setAdmins(filteredAdmins)

      } catch (error) {
        console.log(error)

      } finally {
        setLoading(false)
      }
    }, [])
    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAdmins()
    }, [fetchAdmins])

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        const token =
          localStorage.getItem("token")

        await api.post(
          "/users/admins",
          {
            ...formData,
            role: "admin",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        setFormData({
          username: "",
          password: "",
        })

        fetchAdmins()

      } catch (error) {
        console.log(error.response?.data) 
        console.log(error.response?.status) 
        alert(error.response?.data?.message || "Gagal tambah admin")
      }
    }

  const handleDelete =
    async (id) => {

      const confirmDelete =
        confirm(
          "Yakin ingin menghapus admin?"
        )

      if (!confirmDelete) return

      try {

        const token =
          localStorage.getItem("token")

        await api.delete(
          `/users/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        fetchAdmins()

      } catch (error) {
        console.log(error)
        alert("Gagal hapus admin")
      }
    }

  const filteredAdmins =
    admins.filter((item) =>
      item.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

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

      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-5">

        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/15 flex items-center justify-center">
          <ShieldCheck size={40} />
        </div>

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Kelola Admin
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Tambah dan kelola akun admin sistem.
          </p>

        </div>

      </div>

    </div>

    {/* FORM */}
    <div className="bg-white rounded-[32px] p-5 sm:p-8 shadow-sm border border-slate-100 mb-6 lg:mb-10">

      <div className="flex items-center gap-3 mb-6">

        <UserPlus className="text-[#004D4D]" />

        <h2 className="text-xl lg:text-2xl font-black text-slate-800">
          Tambah Admin
        </h2>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5"
      >

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
          className="px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          className="px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#004D4D] hover:bg-[#006666] text-white py-4 rounded-2xl font-semibold transition"
        >

          Tambah Admin

        </button>

      </form>

    </div>

    {/* SEARCH */}
    <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-sm border border-slate-100 mb-6 lg:mb-8">

      <div className="relative w-full sm:max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari admin..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
        />

      </div>

    </div>

    {/* ADMIN LIST */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-8">

      {filteredAdmins.map((admin) => (

        <div
          key={admin.id}
          className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100"
        >

          <div className="flex items-center justify-between gap-3">

            <div className="w-16 h-16 rounded-full bg-[#DFF6F3] flex items-center justify-center text-2xl">
              👤
            </div>

            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              Admin
            </span>

          </div>

          <h2 className="text-xl lg:text-2xl font-black text-slate-800 mt-6">
            {admin.username}
          </h2>

          <p className="text-slate-500 mt-3">
            Admin sistem pengaduan masyarakat.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">

            {/* CHAT */}
            <button
              onClick={() =>
                router.push(
                  `/superadmin/chat/${admin.id}`
                )
              }
              className="relative flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition bg-blue-100 text-blue-700 hover:bg-blue-200"
            >

              <MessageCircle size={18} />

              Chat

              {admin.unread_count > 0 && (

                <div className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">

                  {admin.unread_count}

                </div>

              )}

            </button>

            {/* DELETE */}
            <button
              onClick={() =>
                handleDelete(admin.id)
              }
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition bg-red-100 text-red-700 hover:bg-red-200"
            >

              <Trash2 size={18} />

              Hapus

            </button>

          </div>

        </div>

      ))}

    </div>

  </div>
)
}