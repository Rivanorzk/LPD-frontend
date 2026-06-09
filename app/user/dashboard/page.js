"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import ReportThread from "@/components/ReportThread"

import * as Icons from "lucide-react"


export default function DashboardPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
 const fetchCategories = async () => {
   try {
     const response = await api.get( "/categories" ) 
     setCategories(response.data) 
    } catch (error){
      console.log(error) 
    } 
  }

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

  const fetchUser = async () => {
  try {
    const token = localStorage.getItem("token")

    console.log("TOKEN:", token)

    const response = await api.get(
      "/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log("USER RESPONSE:", response.data)

    setUser(response.data)
  } catch (error) {
    console.log("ERROR USER:", error)
  }
}

const filteredReports = reports.filter((report) => {
   const keyword = search.toLowerCase() 
   return ( report.header ?.toLowerCase()
   .includes(keyword) 
  ) })

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchReports(),
        fetchUser(),
      ])
    }

    fetchData()
  }, [])

  return (
  <>
    {/* HEADER */}
    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        mb-10
      "
    >
      <div>
        <h1 className="text-2xl lg:text-4xl font-bold text-slate-800">
          Halo, {user?.username}!
        </h1>

        <p className="text-slate-500 mt-2">
          Apa yang ingin Anda laporkan hari ini?
        </p>
      </div>

      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
          w-full
          lg:w-auto
        "
      >
        <input
          type="text"
          placeholder="Cari laporan..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            lg:w-[350px]
            px-5
            py-4
            rounded-2xl
            border
            border-slate-200
            bg-white
          "
        />

        <button
          onClick={() =>
            router.push("/user/report")
          }
          className="
            bg-[#004D4D]
            text-white
            px-6
            py-4
            rounded-2xl
            font-semibold
            hover:bg-[#006666]
            transition
            whitespace-nowrap
          "
        >
          + Buat Laporan
        </button>
      </div>
    </div>

    {/* STATS */}
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5
        gap-5
        mb-10
      "
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-slate-500">
          Total Laporan
        </p>

        <h2 className="text-3xl lg:text-4xl font-bold mt-2">
          {reports.length}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-slate-500">
          Menunggu
        </p>

        <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-blue-500">
          {
            reports.filter(
              (r) =>
                r.status === "Menunggu"
            ).length
          }
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-slate-500">
          Diproses
        </p>

        <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-yellow-500">
          {
            reports.filter(
              (r) =>
                r.status ===
                "Dalam Proses"
            ).length
          }
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-slate-500">
          Selesai
        </p>

        <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-green-600">
          {
            reports.filter(
              (r) =>
                r.status ===
                "Selesai"
            ).length
          }
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-slate-500">
          Ditolak
        </p>

        <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-red-600">
          {
            reports.filter(
              (r) =>
                r.status ===
                "Ditolak"
            ).length
          }
        </h2>
      </div>
    </div>

    {/* CATEGORY */}
    <section className="mb-14">
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-3
          mb-6
        "
      >
        <h2 className="text-2xl lg:text-3xl font-bold">
          Kategori Laporan
        </h2>

        <button
          onClick={() =>
            router.push(
              "/user/categories"
            )
          }
          className="
            text-teal-700
            font-medium
            hover:underline
            text-left
          "
        >
          Lihat Semua
        </button>
      </div>

      <div
        className="
          flex
          gap-5
          overflow-x-auto
          no-scrollbar
          pb-2
          snap-x
          snap-mandatory
        "
      >
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
              className="
                min-w-[260px]
                shrink-0
                snap-start
                bg-white
                rounded-3xl
                p-6
                cursor-pointer
                hover:shadow-xl
                transition
                hover:-translate-y-1
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-[#DFF6F3]
                  mb-5
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon
                  size={30}
                  className="text-[#004D4D]"
                />
              </div>

              <h3 className="font-semibold text-lg">
                {item.nama_kategori}
              </h3>

              <p className="text-slate-500 mt-2 text-sm">
                Laporan aktif
              </p>
            </div>
          )
        })}
      </div>
    </section>

    {/* LAPORAN */}
    <section>
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-3
          mb-8
        "
      >
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">
            Laporan Terbaru
          </h2>

          <p className="text-slate-500 mt-2">
            Laporan dan diskusi warga
            sekitar
          </p>
        </div>

        <button
          onClick={() =>
            router.push("/user/reports")
          }
          className="
            text-teal-700
            font-medium
            hover:underline
            text-left
          "
        >
          Lihat Semua
        </button>
      </div>

      <ReportThread
        reports={filteredReports}
        setReports={setReports}
        from="dashboard"
      />
    </section>
  </>
)
}