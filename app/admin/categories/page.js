"use client"

import { useEffect, useState } from "react"

import {
  FolderKanban,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react"

import * as Icons from "lucide-react"
import api from "@/lib/api"
import RoleLayout from "@/components/RoleLayout"

export default function CategoryPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)

useEffect(() => {
  const loadData = async () => {
    try {
      const response = await api.get(
        "/categories"
      )

      setCategories(response.data)

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false)
    }
  }

  loadData()
}, [])


const refreshCategories = async () => {

  const response = await api.get(
    "/categories"
  )

  setCategories(response.data)
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {

    const token =
      localStorage.getItem("token")

    await api.post(
      "/category-requests",
      {
        nama_kategori: name,

        action_type:
          editId
            ? "update"
            : "create",

        category_id:
          editId || null,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )

    alert(
      "Request kategori berhasil dikirim ke superadmin"
    )

    setName("")
    setEditId(null)

  } catch (error) {
    console.log(error)

    alert(
      "Gagal mengirim request"
    )
  }
}

const handleDelete = async (id) => {

  const confirmDelete = confirm(
    "Kirim request hapus kategori ke superadmin?"
  )

  if (!confirmDelete) return

  try {

    const token =
      localStorage.getItem("token")

    const selectedCategory =
      categories.find(
        (item) => item.id === id
      )

    await api.post(
      "/category-requests",
      {
        nama_kategori:
          selectedCategory.nama_kategori,

        action_type: "delete",

        category_id: id,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )

    alert(
      "Request hapus berhasil dikirim ke superadmin"
    )

  } catch (error) {

    console.log(error)

    alert(
      "Gagal mengirim request"
    )
  }
}

  const handleEdit = (item) => {
    setEditId(item.id)
    setName(item.nama_kategori)
  }

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[400px] rounded-[32px] animate-pulse" />
    </div>
  )
}

  return (
  <div>

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-5 sm:p-8 lg:p-10 text-white shadow-xl">

      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-5">

        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-white/15 flex items-center justify-center">
          <FolderKanban size={40} />
        </div>

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Request Kategori
          </h1>

          <p className="text-white/80 mt-3 text-base lg:text-lg">
            Request kategori ke superadmin
          </p>

        </div>

      </div>

    </div>

    {/* FORM */}
    <div className="bg-white rounded-[32px] p-5 sm:p-8 mt-6 lg:mt-10 shadow-sm border border-slate-100">

      <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-6">
        {editId
          ? "Edit Kategori"
          : "Tambah Kategori"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >

        <input
          type="text"
          placeholder="Masukkan nama kategori..."
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full sm:flex-1 px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004D4D]"
          required
        />

        <button
          type="submit"
          className="w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-7 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
        >

          <Plus size={20} />

          {editId
            ? "Update"
            : "Tambah"}

        </button>

      </form>

    </div>

    {/* LIST */}
    <div className="bg-white rounded-[32px] p-5 sm:p-8 mt-6 lg:mt-10 shadow-sm border border-slate-100">

      <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-8">
        Daftar Kategori
      </h2>

      <div className="space-y-5">

        {categories.length === 0 ? (

          <div className="text-center py-16">

            <div className="text-7xl mb-4">
              📂
            </div>

            <h3 className="text-2xl font-bold text-slate-700">
              Belum Ada Kategori
            </h3>

          </div>

        ) : (

          categories.map((item) => (

            <div
              key={item.id}
              className="border border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
            >

              <div className="flex items-center gap-4 w-full">

                <div className="w-16 h-16 rounded-3xl bg-[#004D4D]/10 text-[#004D4D] flex items-center justify-center">

                  {(() => {

                    const CategoryIcon =
                      Icons[item.icon]
                      || Icons.FolderKanban

                    return (
                      <CategoryIcon size={28} />
                    )

                  })()}

                </div>

                <div>

                  <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                    {item.nama_kategori}
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {item.icon ||
                      "FolderKanban"}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 w-12 h-12 rounded-2xl flex items-center justify-center transition"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  className="bg-red-100 hover:bg-red-200 text-red-700 w-12 h-12 rounded-2xl flex items-center justify-center transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  </div>
)
}