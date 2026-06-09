"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import nextDynamic from "next/dynamic"
import api from "@/lib/api" 
import { Heart, MessageCircle } from "lucide-react"

export const dynamic = "force-dynamic";

const LocationPicker = nextDynamic(
  () => import("@/components/LocationPicker"),
  {
    ssr: false,
  }
)

export default function CreateReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const [categories, setCategories] = useState([])
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState(null)
  const [user, setUser] =
  useState(null)

  const initialCategory = searchParams.get("category") || ""

  const [formData, setFormData] = useState({
    header: "",
    body: "",
    category_id: initialCategory,
    location: "",
    latitude: "",
    longitude: "",
    image: null,
  })
  
useEffect(() => {

  const fetchUser =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        const response =
          await api.get(
            "/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        setUser(
          response.data
        )

      } catch (error) {

        console.log(error)
      }
    }

  fetchUser()

}, [])

 useEffect(() => {
  const loadCategories = async () => {
    try {
      const response = await api.get(
        "/categories"
      )

      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  loadCategories()
}, [])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]

    setFormData({
      ...formData,
      image: file,
    })

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      const payload = new FormData()

      payload.append("header", formData.header)
      payload.append("body", formData.body)
      payload.append("category_id", formData.category_id)
      payload.append("location", formData.location)
      payload.append("latitude", formData.latitude)
      payload.append("longitude", formData.longitude)
      payload.append("image", formData.image)

      await api.post(
        "/report",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      window.dispatchEvent(
        new Event(
          "notifications_changed"
        )
      )
      alert("Laporan berhasil dibuat")
      router.push("/user/dashboard")
    } catch (error) {
      console.log(error)
      alert("Gagal membuat laporan")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="max-w-7xl mx-auto">
    {/* HEADER */}
    <div className="mb-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
        Buat Laporan Baru
      </h1>

      <p className="text-slate-500 mt-3 text-base lg:text-lg">
        Laporkan masalah di sekitar Anda untuk membantu kota menjadi lebih baik.
      </p>
    </div>

    {/* FORM */}
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-5 lg:p-10 max-w-5xl">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* JUDUL */}
        <div>
          <label className="block mb-3 text-base lg:text-lg font-semibold text-slate-700">
            Judul Laporan
          </label>

          <input
            type="text"
            name="header"
            placeholder="Contoh: Jalan Berlubang di Margonda"
            value={formData.header}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004D4D] bg-slate-50"
            required
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block mb-3 text-base lg:text-lg font-semibold text-slate-700">
            Kategori Laporan
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004D4D] bg-slate-50"
            required
          >
            <option value="">
              Pilih kategori laporan
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        {/* LOKASI */}
        <div>
          <label className="block mb-3 text-base lg:text-lg font-semibold text-slate-700">
            Lokasi
          </label>

          <input
            type="text"
            name="location"
            placeholder="Contoh: Jl. Margonda Raya, Depok"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004D4D] bg-slate-50"
            required
          />

          <div className="mt-6">
            <label className="block mb-3 text-base lg:text-lg font-semibold">
              Pilih Lokasi di Peta
            </label>

            <LocationPicker
              setPosition={async (latlng) => {
                setPosition(latlng)

                try {
                  const response = await api.get(
                    "/location/reverse",
                    {
                      params: {
                        lat: latlng.lat,
                        lon: latlng.lng,
                      },
                    }
                  )

                  const address =
                    response.data.display_name

                  setFormData((prev) => ({
                    ...prev,
                    location: address,
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  }))
                } catch (error) {
                  console.log(error)

                  setFormData((prev) => ({
                    ...prev,
                    location: `${latlng.lat}, ${latlng.lng}`,
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  }))
                }
              }}
            />
          </div>
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="block mb-3 text-base lg:text-lg font-semibold text-slate-700">
            Isi Laporan
          </label>

          <textarea
            name="body"
            rows="7"
            placeholder="Jelaskan detail masalah yang ingin dilaporkan..."
            value={formData.body}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004D4D] bg-slate-50 resize-none"
            required
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-3 text-base lg:text-lg font-semibold text-slate-700">
            Upload Foto
          </label>

          <label className="border-2 border-dashed border-slate-300 rounded-3xl overflow-hidden bg-slate-50 hover:bg-slate-100 transition cursor-pointer block">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-[250px] lg:h-[350px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-semibold">
                  Ganti Foto
                </div>
              </div>
            ) : (
              <div className="p-6 lg:p-10 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4">📸</div>
                <p className="font-semibold text-slate-700 text-lg">Klik untuk upload foto laporan</p>
                <p className="text-slate-500 mt-2 text-sm">PNG, JPG, JPEG</p>
              </div>
            )}

            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>

        {/* PREVIEW THREAD */}
        <div className="bg-[#F8FAFA] rounded-3xl p-5 lg:p-8 border border-slate-200">
          <h2 className="text-xl lg:text-2xl font-bold mb-6 text-slate-800">
            Preview Thread Laporan
          </h2>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#DFF6F3] overflow-hidden flex items-center justify-center text-2xl sm:text-3xl">
                {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  ) : (

                    <span className="text-xl">
                      👤
                    </span>

                  )}
              </div>

              <div>
                <h3 className="font-bold text-lg">
                   {user?.username || "Anda"}
                </h3>

                <p className="text-sm text-slate-500">
                  Baru saja • {formData.location || "Lokasi belum diisi"}
                </p>
              </div>
            </div>

            <h2 className="text-lg lg:text-2xl font-bold text-slate-800 mb-3">
              {formData.header || "Judul laporan Anda"}
            </h2>

            <p className="text-slate-600 leading-relaxed mb-5 break-words">
              {formData.body ||
                "Isi laporan akan tampil di sini sebagai thread publik."}
            </p>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-[220px] lg:h-[350px] object-cover rounded-3xl mb-5"
              />
            )}

            <div className="flex items-center gap-6 text-slate-500 border-t pt-5">
              <button type="button" className="flex items-center gap-2 hover:text-teal-700 transition">
                <Heart className="w-5 h-5" />
                <span>0 like</span>
              </button>

              <button type="button" className="flex items-center gap-2 hover:text-teal-700 transition">
                <MessageCircle className="w-5 h-5" />
                <span>0 komentar</span>
              </button>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-8 py-4 rounded-2xl font-semibold transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>

      </form>
    </div>
  </div>
)
}
