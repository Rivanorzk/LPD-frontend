"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

import Navbar from "@/components/Navbar"

import * as Icons from "lucide-react"

export default function CategoriesPage() {

  const router = useRouter()

  const [categories, setCategories] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {

    const fetchCategories =
      async () => {

        try {

          const response =
            await api.get(
              "/categories"
            )

          setCategories(response.data)

        } catch (error) {
          console.log(error)

        } finally {
          setLoading(false)
        }
      }

    fetchCategories()

  }, [])

  if (loading) {
  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-6 lg:p-10 text-white shadow-xl mb-10">
        <h1 className="text-3xl lg:text-5xl font-black">
          Semua Kategori
        </h1>

        <p className="text-white/80 mt-4 text-base lg:text-lg">
          Pilih kategori laporan sesuai masalah yang ingin Anda laporkan.
        </p>
      </div>

      {/* SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm animate-pulse"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-200 mb-6" />

            <div className="h-6 bg-slate-200 rounded mb-4" />

            <div className="h-4 bg-slate-200 rounded mb-2" />

            <div className="h-4 bg-slate-200 rounded w-3/4 mb-6" />

            <div className="h-12 bg-slate-200 rounded-2xl" />
          </div>
        ))}
      </div>

    </div>
  )
}

return (
  <div className="max-w-7xl mx-auto">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-[#004D4D] to-[#006666] rounded-[32px] p-6 lg:p-10 text-white shadow-xl mb-10">
      <h1 className="text-3xl lg:text-5xl font-black">
        Semua Kategori
      </h1>

      <p className="text-white/80 mt-4 text-base lg:text-lg">
        Pilih kategori laporan sesuai masalah yang ingin Anda laporkan.
      </p>
    </div>

    {/* CATEGORY GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

      {categories.map((item) => {

        const Icon =
          Icons[item.icon] ||
          Icons.FileText

        return (
          <div
            key={item.id}
            onClick={() =>
              router.push(
                `/user/report?category=${item.id}`
              )
            }
            className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
          >

            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-[#DFF6F3] flex items-center justify-center mb-6">
              <Icon
                size={32}
                className="text-[#004D4D]"
              />
            </div>

            <h2 className="text-xl lg:text-2xl font-black text-slate-800 leading-snug">
              {item.nama_kategori}
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed text-sm lg:text-base">
              Klik untuk membuat laporan pada kategori ini.
            </p>

            <button
              className="mt-6 lg:mt-8 w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-5 py-3 rounded-2xl font-semibold transition"
            >
              Buat Laporan
            </button>

          </div>
        )
      })}

    </div>

  </div>
)}