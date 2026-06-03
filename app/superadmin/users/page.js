"use client"

import { useEffect, useState } from "react"

import NavbarSuperAdmin from "@/components/NavbarSuperAdmin"

import {
  Users,
  ShieldCheck,
  User,
  Trash2,
  Search,
} from "lucide-react"
import api from "@/lib/api"

export default function ManageUsersPage() {

  const [users, setUsers] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState("")

  async function fetchUsers() {

    try {

      const token =
        localStorage.getItem("token")

      const response =
        await api.get(
          "/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      setUsers(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    const loadUsers =
      async () => {

      await fetchUsers()
    }

    loadUsers()

  }, [])

  const handleDelete =
    async (id) => {

    const confirmDelete =
      confirm(
        "Yakin ingin menghapus user?"
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

      setUsers(
        users.filter(
          (item) =>
            item.id !== id
        )
      )

      alert(
        "User berhasil dihapus"
      )

    } catch (error) {

      console.log(error)

      alert(
        "Gagal menghapus user"
      )
    }
  }

  const handleRoleChange =
    async (id, role) => {

    try {

      const token =
        localStorage.getItem("token")

      await api.put(
        `/users/role/${id}`,
        {
          role,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      setUsers(
        users.map((item) => {

          if (item.id === id) {
            return {
              ...item,
              role,
            }
          }

          return item
        })
      )

      alert(
        "Role berhasil diupdate"
      )

    } catch (error) {

      console.log(error)

      alert(
        "Gagal update role"
      )
    }
  }

  const filteredUsers =
    users.filter((item) =>
      item.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  const totalUsers =
    users.filter(
      (item) =>
        item.role === "user"
    ).length

  const totalAdmins =
    users.filter(
      (item) =>
        item.role === "admin"
    ).length

  const totalSuperAdmins =
    users.filter(
      (item) =>
        item.role === "superadmin"
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
            Kelola User
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Manajemen seluruh pengguna sistem
          </p>

        </div>

        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white/15 flex items-center justify-center">

          <Users size={42} />

        </div>

      </div>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 mb-6 lg:mb-10">

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Total User
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">

              {totalUsers}

            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">

            <User size={28} />

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Total Admin
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">

              {totalAdmins}

            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">

            <ShieldCheck size={28} />

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[32px] p-5 lg:p-7 shadow-sm border border-slate-100 sm:col-span-2 xl:col-span-1">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-slate-500">
              Superadmin
            </p>

            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mt-3">

              {totalSuperAdmins}

            </h2>

          </div>

          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">

            <Users size={28} />

          </div>

        </div>

      </div>

    </div>

    {/* USER LIST */}
    <div className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h2 className="text-xl lg:text-2xl font-black text-slate-800">
            Daftar Pengguna
          </h2>

          <p className="text-slate-500 mt-2">
            Semua akun dalam sistem
          </p>

        </div>

        <div className="relative w-full lg:w-[320px]">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari user..."
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

        {filteredUsers.map((item) => (

          <div
            key={item.id}
            className="border border-slate-100 rounded-3xl p-5"
          >

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center font-black">

                {item.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

              <div>

                <h3 className="font-bold text-slate-800">
                  {item.username}
                </h3>

              </div>

            </div>

            <div className="mt-4">

              <span className={`
                px-4 py-2 rounded-2xl text-sm font-bold

                ${item.role === "user"
                  ? "bg-blue-100 text-blue-700"
                  : ""}

                ${item.role === "admin"
                  ? "bg-yellow-100 text-yellow-700"
                  : ""}

                ${item.role === "superadmin"
                  ? "bg-green-100 text-green-700"
                  : ""}
              `}>

                {item.role}

              </span>

            </div>

            <select
              value={item.role}
              onChange={(e) =>
                handleRoleChange(
                  item.id,
                  e.target.value
                )
              }
              className="w-full mt-4 border border-slate-200 rounded-2xl px-4 py-3 outline-none"
            >

              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="superadmin">
                Superadmin
              </option>

            </select>

            <button
              onClick={() =>
                handleDelete(item.id)
              }
              className="w-full mt-4 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center"
            >

              <Trash2 size={18} />

            </button>

          </div>

        ))}

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-100 text-left">

              <th className="pb-5 text-slate-500">
                Username
              </th>

              <th className="pb-5 text-slate-500">
                Role
              </th>

              <th className="pb-5 text-slate-500">
                Ganti Role
              </th>

              <th className="pb-5 text-slate-500">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-100"
              >

                <td className="py-6">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center font-black">

                      {item.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <h3 className="font-bold text-slate-800">

                      {item.username}

                    </h3>

                  </div>

                </td>

                <td className="py-6">

                  <span className={`
                    px-4 py-2 rounded-2xl text-sm font-bold

                    ${item.role === "user"
                      ? "bg-blue-100 text-blue-700"
                      : ""}

                    ${item.role === "admin"
                      ? "bg-yellow-100 text-yellow-700"
                      : ""}

                    ${item.role === "superadmin"
                      ? "bg-green-100 text-green-700"
                      : ""}
                  `}>

                    {item.role}

                  </span>

                </td>

                <td className="py-6">

                  <select
                    value={item.role}
                    onChange={(e) =>
                      handleRoleChange(
                        item.id,
                        e.target.value
                      )
                    }
                    className="border border-slate-200 rounded-2xl px-4 py-3 outline-none"
                  >

                    <option value="user">
                      User
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                    <option value="superadmin">
                      Superadmin
                    </option>

                  </select>

                </td>

                <td className="py-6">

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition"
                  >

                    <Trash2 size={20} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredUsers.length === 0 && (

          <div className="text-center py-16">

            <div className="text-7xl mb-4">
              👥
            </div>

            <h3 className="text-2xl font-black text-slate-700">

              User Tidak Ditemukan

            </h3>

          </div>

        )}

      </div>

    </div>

  </div>
)
}

