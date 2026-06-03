"use client"

import { useEffect, useState } from "react"

import {
  User,
  ShieldCheck,
  Calendar,
  FileText,
  CheckCircle2,
  Clock3,
  Hourglass,
  Crown,
  Camera,
  Eye,
  MapPin,
  CircleX,
} from "lucide-react"

import { useRouter } from "next/navigation"

import RoleLayout from "@/components/RoleLayout"
import { roleConfig } from "@/constant/roleConfig"

import api from "@/lib/api"

export default function ProfilePage() {

  const router =
    useRouter()

  const [user, setUser] =
    useState(null)

  const [reports, setReports] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [previewImage,
    setPreviewImage] =
    useState(null)

  const [showEditModal,
  setShowEditModal] =
  useState(false)

  const [username,
    setUsername] =
    useState("")

  const [oldPassword,
    setOldPassword] =
    useState("")

  const [newPassword,
    setNewPassword] =
    useState("")

  const [saving,
    setSaving] =
    useState(false)

  const [uploading,
    setUploading] =
    useState(false)

  useEffect(() => {

    const fetchData =
      async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        const headers = {
          Authorization:
            `Bearer ${token}`,
        }

        const [
          userResponse,
          reportResponse,
        ] = await Promise.all([

          api.get(
            "/profile",
            { headers }
          ),

          api.get(
            "/report",
            { headers }
          ),
        ])

        setUser(
          userResponse.data
        )

        setUsername(
          userResponse.data.username
        )

        setReports(
          reportResponse.data
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

    fetchData()

  }, [])


  const handleProfileImage =
    async (e) => {

    const file =
      e.target.files[0]

    if (!file) return

    try {

      setUploading(true)

      const token =
        localStorage.getItem(
          "token"
        )

      const formData =
        new FormData()

      formData.append(
        "image",
        file
      )

      const response =
        await api.put(
          "/profile/image",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        )

      const imageUrl = response.data.image

      setPreviewImage(
        imageUrl
      )

      setUser((prev) => ({
        ...prev,
        image:
          response.data.image,
      }))

    } catch (error) {

      console.log(error)

      alert(
        "Gagal upload foto"
      )

    } finally {

      setUploading(false)
    }
  }

  const handleUpdateProfile =
  async () => {

  try {

    setSaving(true)

    const token =
      localStorage.getItem(
        "token"
      )

    await api.put(
      "/profile",
      {
        username,
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )

    setUser((prev) => ({
      ...prev,
      username,
    }))

    setShowEditModal(false)

    setOldPassword("")
    setNewPassword("")

    alert(
      "Profil berhasil diperbarui"
    )

  } catch (error) {

    console.log(error)

    alert(
      error?.response?.data?.message ||
      "Gagal update profil"
    )

  } finally {

    setSaving(false)
  }
}


  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Loading...

      </div>
    )
  }

  const currentRole =
    roleConfig[user?.role]
    || roleConfig.user


  const visibleReports =

    user?.role === "user"

      ? reports.filter(
          (report) =>
            report.user_id === user.id
        )

      : reports


  const totalReports =
    visibleReports.length

  const pendingReports =
    visibleReports.filter(
      (r) =>
        r.status === "Menunggu"
    ).length

  const processedReports =
    visibleReports.filter(
      (r) =>
        r.status ===
        "Dalam Proses"
    ).length

  const completedReports =
    visibleReports.filter(
      (r) =>
        r.status === "Selesai"
    ).length

  const rejectedReports =
    visibleReports.filter(
      (r) => 
        r.status === "Ditolak"
    ).length

return (

  <RoleLayout role={user?.role}>

    <div>

        {/* HEADER */}
        <div className={`
          bg-gradient-to-r
          ${currentRole.gradient}
          rounded-[32px]
          p-10
          text-white
          shadow-xl
          relative
          overflow-hidden
        `}>

          <div className="
            absolute
            top-0
            right-0
            opacity-10
            text-[250px]
            font-black
          ">

            LPD

          </div>

          <div className="
            relative
            z-10
            flex
            items-center
            justify-between
            flex-wrap
            gap-10
          ">

            {/* PROFILE */}
            <div className="
              flex
              items-center
              gap-8
            ">

              <div className="relative">

                <div className="
                  w-32
                  h-32
                  rounded-full
                  overflow-hidden
                  bg-white/20
                  border
                  border-white/20
                  shadow-lg
                ">

                  {previewImage ||
                  user?.image ? (

                    <img
                      src={
                        previewImage ||
                        user?.image
                      }
                      alt="Profile"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  ) : (

                    <div className="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                      text-6xl
                    ">

                      {currentRole.emoji}

                    </div>
                  )}
                </div>

                <label className="
                  absolute
                  bottom-0
                  right-0
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  text-slate-700
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  shadow-lg
                ">

                  <Camera size={18} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleProfileImage
                    }
                  />
                </label>
              </div>

              <div>

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/15
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                  mb-5
                ">

                  {user?.role ===
                    "superadmin" && (
                    <Crown size={16} />
                  )}

                  {currentRole.badge}

                </div>

                <h1 className="
                  text-5xl
                  font-black
                ">

                  {user?.username}

                </h1>

                <div className="
                  flex
                  items-center
                  gap-3
                  mt-4
                  flex-wrap
                ">

                  <div className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    flex
                    items-center
                    gap-2
                    text-sm
                  ">

                    <ShieldCheck size={16} />

                    {user?.role}

                  </div>

                  <div className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    flex
                    items-center
                    gap-2
                    text-sm
                  ">

                    <Calendar size={16} />

                    {currentRole.title}

                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="
              grid
              grid-cols-3
              xl:grid-cols-5
              gap-5
            ">

              {[
                {
                  title: "Total",
                  value: totalReports,
                  color: "text-white",
                },

                {
                  title: "Menunggu",
                  value: pendingReports,
                  color: "text-blue-400",
                },

                {
                  title: "Diproses",
                  value: processedReports,
                  color: "text-yellow-400",
                },

                {
                  title: "Selesai",
                  value: completedReports,
                  color: "text-green-400",
                },
              
                {
                  title: "Ditolak",
                  value: rejectedReports,
                  color: "text-red-400",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-white/10
                    rounded-3xl
                    p-6
                    min-w-[160px]
                  "
                >

                  <p className="
                    text-white/70
                    text-sm
                  ">

                    {item.title}

                  </p>

                  <h2 className={`
                    text-4xl
                    font-black
                    mt-2
                    ${item.color}
                  `}>

                    {item.value}

                  </h2>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-8
          mt-10
        ">

          {/* LEFT */}
          <div className="space-y-8">

            {/* ACCOUNT */}
            <div className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
              border
              border-slate-100
            ">

              <h2 className="
                text-2xl
                font-black
                mb-6
                text-slate-800
              ">

                Informasi Akun

              </h2>

              <div className="space-y-5">

                {uploading && (

                  <div className="
                    bg-blue-50
                    text-blue-700
                    px-4
                    py-3
                    rounded-2xl
                    text-sm
                    font-medium
                  ">

                    Mengupload foto...

                  </div>
                )}

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-[#DFF6F3]
                    flex
                    items-center
                    justify-center
                    text-[#004D4D]
                  ">

                    <User size={22} />

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Username

                    </p>

                    <h3 className="
                      font-semibold
                      text-lg
                      text-slate-800
                    ">

                      {user?.username}

                    </h3>

                  </div>
                </div>

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-[#DFF6F3]
                    flex
                    items-center
                    justify-center
                    text-[#004D4D]
                  ">

                    <ShieldCheck size={22} />

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Role

                    </p>

                    <h3 className="
                      font-semibold
                      text-lg
                      text-slate-800
                      capitalize
                    ">

                      {user?.role}

                    </h3>

                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowEditModal(true)
                }
                className="
                  w-full
                  mt-8
                  bg-[#004D4D]
                  hover:bg-[#006666]
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >
                Edit Profil
              </button>
              {/* LOGOUT */}
              <button
                onClick={() => {

                  localStorage.removeItem(
                    "token"
                  )

                  router.push(
                    "/login"
                  )
                }}
                className="
                  w-full
                  mt-8
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >

                Logout

              </button>
            </div>

            {/* SUMMARY */}
            <div className="
              bg-white
              rounded-[32px]
              p-8
              shadow-sm
              border
              border-slate-100
            ">

              <h2 className="
                text-2xl
                font-black
                mb-6
                text-slate-800
              ">

                Ringkasan

              </h2>

              <div className="space-y-5">

                {[
                  {
                    icon: FileText,
                    label: "Total",
                    value: totalReports,
                    color: "",
                  },

                  {
                    icon: Hourglass,
                    label: "Menunggu",
                    value: pendingReports,
                    color: "text-blue-600",
                  },

                  {
                    icon: Clock3,
                    label: "Diproses",
                    value: processedReports,
                    color: "text-yellow-600",
                  },

                  {
                    icon: CheckCircle2,
                    label: "Selesai",
                    value: completedReports,
                    color: "text-green-600",
                  },
                  
                  {
                    icon: CircleX,
                    label: "Ditolak",
                    value: rejectedReports,
                    color: "text-red-600",
                  },
                ].map((item, index) => {

                  const Icon =
                    item.icon

                  return (

                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div className="
                        flex
                        items-center
                        gap-3
                      ">

                        <Icon size={18} />

                        <span>

                          {item.label}

                        </span>

                      </div>

                      <span className={`
                        font-bold
                        ${item.color}
                      `}>

                        {item.value}

                      </span>

                    </div>
                  )
                })}
              </div>
            </div>
          </div>
            {/* RIGHT */}
            <div className="xl:col-span-2">

              {user?.role === "superadmin" ? (

                /* SUPERADMIN ACCESS */
                <div className="
                  bg-white
                  rounded-[32px]
                  p-8
                  shadow-sm
                  border
                  border-slate-100
                ">

                  <div className="mb-8">

                    <h2 className="
                      text-3xl
                      font-black
                      text-slate-800
                    ">

                      Pengingat Hak Akses

                    </h2>

                    <p className="
                      text-slate-500
                      mt-2
                    ">

                      Anda memiliki akses penuh terhadap sistem

                    </p>

                  </div>

                  <div className="
                    bg-[#F4F7F6]
                    rounded-[28px]
                    p-8
                  ">

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-6
                    ">

                      <Crown
                        size={28}
                        className="text-[#004D4D]"
                      />

                      <h3 className="
                        text-2xl
                        font-black
                        text-[#004D4D]
                      ">

                        Super Administrator

                      </h3>

                    </div>

                    <ul className="
                      space-y-5
                      text-slate-700
                    ">

                      <li>
                        • Mengakses seluruh laporan masyarakat
                      </li>

                      <li>
                        • Mengelola akun administrator
                      </li>

                      <li>
                        • Mengelola kategori laporan
                      </li>

                      <li>
                        • Monitoring aktivitas sistem
                      </li>

                      <li>
                        • Memiliki akses penuh terhadap website
                      </li>

                    </ul>
                  </div>
                </div>

              ) : (

                /* THREAD USER & ADMIN */
                <div className="
                  bg-white
                  rounded-[32px]
                  p-8
                  shadow-sm
                  border
                  border-slate-100
                ">

                  <div className="mb-8">

                    <h2 className="
                      text-3xl
                      font-black
                      text-slate-800
                    ">

                      {
                        user?.role === "user"
                          ? "Laporan Saya"
                          : "Laporan Terbaru"
                      }

                    </h2>

                    <p className="
                      text-slate-500
                      mt-2
                    ">

                      {
                        user?.role === "user"
                          ? "Daftar laporan yang telah Anda buat"
                          : "Monitoring laporan masyarakat"
                      }

                    </p>

                  </div>

                  <div className="space-y-6">

                    {visibleReports.length === 0 ? (

                      <div className="
                        text-center
                        py-20
                      ">

                        <div className="
                          text-7xl
                          mb-5
                        ">

                          📭

                        </div>

                        <h3 className="
                          text-2xl
                          font-bold
                          text-slate-700
                        ">

                          Belum Ada Laporan

                        </h3>

                      </div>

                    ) : (

                      visibleReports.map((report) => (

                        <div
                          key={report.id}
                          className="
                            border
                            border-slate-100
                            rounded-[32px]
                            overflow-hidden
                            hover:shadow-lg
                            transition
                          "
                        >

                          {report.image && (

                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${report.image}`}
                              alt={report.header}
                              className="
                                w-full
                                h-[280px]
                                object-cover
                              "
                            />
                          )}

                          <div className="p-6">

                            <div className="
                              flex
                              items-start
                              justify-between
                              gap-5
                            ">

                              <div>

                                <h2 className="
                                  text-2xl
                                  font-black
                                  text-slate-800
                                ">

                                  {report.header}

                                </h2>

                                <div className="
                                  flex
                                  items-center
                                  gap-2
                                  mt-3
                                  text-slate-500
                                  text-sm
                                  max-w-[500px]
                                ">

                                  <MapPin
                                    size={15}
                                    className="shrink-0"
                                  />

                                  <p className="line-clamp-2">

                                    {report.location}

                                  </p>

                                </div>
                              </div>

                              <span className="
                                bg-[#DFF6F3]
                                text-[#004D4D]
                                px-4
                                py-2
                                rounded-full
                                text-sm
                                font-semibold
                                whitespace-nowrap
                              ">

                                {report.status}

                              </span>
                            </div>

                            <p className="
                              text-slate-600
                              leading-relaxed
                              mt-5
                              line-clamp-3
                            ">

                              {report.body}

                            </p>

                            <div className="
                              mt-6
                              flex
                              items-center
                              justify-between
                            ">

                              <span className="
                                text-sm
                                text-slate-500
                              ">

                                {new Date(
                                  report.created_at
                                ).toLocaleDateString(
                                  "id-ID"
                                )}

                              </span>

                              <button
                                onClick={() =>
                                  router.push(
                                    `${currentRole.detailRoute}/${report.id}?from=profile`
                                  )
                                }
                                className="
                                  bg-[#004D4D]
                                  hover:bg-[#006666]
                                  text-white
                                  px-5
                                  py-3
                                  rounded-2xl
                                  transition
                                  font-medium
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                <Eye size={18} />

                                Detail

                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

        </div>
        {showEditModal && (
          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-5
          ">

            <div className="
              bg-white
              w-full
              max-w-lg
              rounded-[32px]
              p-8
              shadow-xl
            ">

              <h2 className="
                text-3xl
                font-black
                text-slate-800
              ">
                Edit Profil
              </h2>

              <div className="
                mt-8
                space-y-5
              ">

                <div>
                  <label className="
                    text-sm
                    text-slate-500
                  ">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      mt-2
                      border
                      border-slate-200
                      rounded-2xl
                      px-4
                      py-3
                      outline-none
                    "
                  />
                </div>

                <div>
                  <label className="
                    text-sm
                    text-slate-500
                  ">
                    Password Lama
                  </label>

                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) =>
                      setOldPassword(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      mt-2
                      border
                      border-slate-200
                      rounded-2xl
                      px-4
                      py-3
                      outline-none
                    "
                  />
                </div>

                <div>
                  <label className="
                    text-sm
                    text-slate-500
                  ">
                    Password Baru
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      mt-2
                      border
                      border-slate-200
                      rounded-2xl
                      px-4
                      py-3
                      outline-none
                    "
                  />
                </div>

              </div>

              <div className="
                flex
                justify-end
                gap-3
                mt-8
              ">

                <button
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-slate-300
                  "
                >
                  Batal
                </button>

                <button
                  onClick={
                    handleUpdateProfile
                  }
                  disabled={saving}
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-[#004D4D]
                    text-white
                    font-semibold
                  "
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan"}
                </button>

              </div>

            </div>
          </div>
        )}
          </div>
  </RoleLayout>
)
}

