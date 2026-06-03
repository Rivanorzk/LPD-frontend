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
    <div className="px-4 sm:px-6 lg:px-0">
      {/* HEADER */}
      <div className={`
        bg-gradient-to-r
        ${currentRole.gradient}
        rounded-2xl sm:rounded-[32px]
        p-5 sm:p-6 md:p-8 lg:p-10
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
          text-[150px] sm:text-[200px] lg:text-[250px]
          font-black
          pointer-events-none
        ">
          LPD
        </div>

        <div className="
          relative
          z-10
          flex
          flex-col
          lg:flex-row
          items-start
          lg:items-center
          justify-between
          gap-6 md:gap-8 lg:gap-10
        ">
          {/* PROFILE */}
          <div className="
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            gap-5 sm:gap-6 md:gap-8
            w-full
            lg:w-auto
          ">
            <div className="relative mx-auto sm:mx-0">
              <div className="
                w-24 h-24
                sm:w-28 sm:h-28
                md:w-32 md:h-32
                rounded-full
                overflow-hidden
                bg-white/20
                border-2
                border-white/20
                shadow-lg
              ">
                {previewImage || user?.image ? (
                  <img
                    src={previewImage || user?.image}
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
                    text-4xl sm:text-5xl md:text-6xl
                  ">
                    {currentRole.emoji}
                  </div>
                )}
              </div>

              <label className="
                absolute
                bottom-0
                right-0
                w-9 h-9
                sm:w-10 sm:h-10
                md:w-11 md:h-11
                rounded-full
                bg-white
                text-slate-700
                flex
                items-center
                justify-center
                cursor-pointer
                shadow-lg
                hover:scale-105
                transition-transform
              ">
                <Camera size={16} className="sm:size-[18px]" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImage}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="text-center sm:text-left w-full">
              <div className="
                inline-flex
                items-center
                gap-2
                bg-white/15
                px-3 py-1.5
                sm:px-4 sm:py-2
                rounded-full
                text-xs sm:text-sm
                font-bold
                mb-3 sm:mb-4 md:mb-5
                mx-auto sm:mx-0
              ">
                {user?.role === "superadmin" && (
                  <Crown size={14} className="sm:size-4" />
                )}
                {currentRole.badge}
              </div>

              <h1 className="
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                font-black
                break-words
              ">
                {user?.username}
              </h1>

              <div className="
                flex
                flex-col
                sm:flex-row
                items-center
                gap-2 sm:gap-3
                mt-3 sm:mt-4
                flex-wrap
              ">
                <div className="
                  bg-white/15
                  px-3 py-1.5 sm:px-4 sm:py-2
                  rounded-full
                  flex
                  items-center
                  gap-2
                  text-xs sm:text-sm
                ">
                  <ShieldCheck size={14} className="sm:size-4" />
                  <span className="capitalize">{user?.role}</span>
                </div>

                <div className="
                  bg-white/15
                  px-3 py-1.5 sm:px-4 sm:py-2
                  rounded-full
                  flex
                  items-center
                  gap-2
                  text-xs sm:text-sm
                ">
                  <Calendar size={14} className="sm:size-4" />
                  {currentRole.title}
                </div>
              </div>
            </div>
          </div>

          {/* STATS - Scrollable on mobile */}
          <div className="
            w-full
            lg:w-auto
            overflow-x-auto
            pb-2
            -mb-2
          ">
            <div className="
              flex
              flex-row
              lg:grid
              lg:grid-cols-5
              gap-3 sm:gap-4 md:gap-5
              min-w-[500px]
              lg:min-w-0
            ">
              {[
                { title: "Total", value: totalReports, color: "text-white" },
                { title: "Menunggu", value: pendingReports, color: "text-blue-400" },
                { title: "Diproses", value: processedReports, color: "text-yellow-400" },
                { title: "Selesai", value: completedReports, color: "text-green-400" },
                { title: "Ditolak", value: rejectedReports, color: "text-red-400" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    bg-white/10
                    rounded-2xl sm:rounded-3xl
                    p-3 sm:p-4 md:p-5 lg:p-6
                    min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[160px]
                    flex-1
                  "
                >
                  <p className="
                    text-white/70
                    text-xs sm:text-sm
                  ">
                    {item.title}
                  </p>
                  <h2 className={`
                    text-2xl sm:text-3xl md:text-4xl
                    font-black
                    mt-1 sm:mt-2
                    ${item.color}
                  `}>
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-5 sm:gap-6 md:gap-8
        mt-6 sm:mt-8 md:mt-10
      ">
        {/* LEFT COLUMN */}
        <div className="space-y-5 sm:space-y-6 md:space-y-8">
          {/* ACCOUNT CARD */}
          <div className="
            bg-white
            rounded-2xl sm:rounded-[32px]
            p-5 sm:p-6 md:p-8
            shadow-sm
            border
            border-slate-100
          ">
            <h2 className="
              text-xl sm:text-2xl
              font-black
              mb-4 sm:mb-5 md:mb-6
              text-slate-800
            ">
              Informasi Akun
            </h2>

            <div className="space-y-4 sm:space-y-5">
              {uploading && (
                <div className="
                  bg-blue-50
                  text-blue-700
                  px-3 py-2 sm:px-4 sm:py-3
                  rounded-xl sm:rounded-2xl
                  text-xs sm:text-sm
                  font-medium
                ">
                  Mengupload foto...
                </div>
              )}

              <div className="
                flex
                items-center
                gap-3 sm:gap-4
              ">
                <div className="
                  w-10 h-10 sm:w-12 sm:h-12
                  rounded-xl sm:rounded-2xl
                  bg-[#DFF6F3]
                  flex
                  items-center
                  justify-center
                  text-[#004D4D]
                  shrink-0
                ">
                  <User size={18} className="sm:size-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-slate-500">Username</p>
                  <h3 className="
                    font-semibold
                    text-base sm:text-lg
                    text-slate-800
                    break-words
                  ">
                    {user?.username}
                  </h3>
                </div>
              </div>

              <div className="
                flex
                items-center
                gap-3 sm:gap-4
              ">
                <div className="
                  w-10 h-10 sm:w-12 sm:h-12
                  rounded-xl sm:rounded-2xl
                  bg-[#DFF6F3]
                  flex
                  items-center
                  justify-center
                  text-[#004D4D]
                  shrink-0
                ">
                  <ShieldCheck size={18} className="sm:size-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-slate-500">Role</p>
                  <h3 className="
                    font-semibold
                    text-base sm:text-lg
                    text-slate-800
                    capitalize
                    break-words
                  ">
                    {user?.role}
                  </h3>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="
                w-full
                mt-6 sm:mt-7 md:mt-8
                bg-[#004D4D]
                hover:bg-[#006666]
                text-white
                py-3 sm:py-4
                rounded-xl sm:rounded-2xl
                font-semibold
                transition
                active:scale-[0.98]
              "
            >
              Edit Profil
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="
                w-full
                mt-3 sm:mt-4
                bg-red-500
                hover:bg-red-600
                text-white
                py-3 sm:py-4
                rounded-xl sm:rounded-2xl
                font-semibold
                transition
                active:scale-[0.98]
              "
            >
              Logout
            </button>
          </div>

          {/* SUMMARY CARD */}
          <div className="
            bg-white
            rounded-2xl sm:rounded-[32px]
            p-5 sm:p-6 md:p-8
            shadow-sm
            border
            border-slate-100
          ">
            <h2 className="
              text-xl sm:text-2xl
              font-black
              mb-4 sm:mb-5 md:mb-6
              text-slate-800
            ">
              Ringkasan
            </h2>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {[
                { icon: FileText, label: "Total", value: totalReports, color: "" },
                { icon: Hourglass, label: "Menunggu", value: pendingReports, color: "text-blue-600" },
                { icon: Clock3, label: "Diproses", value: processedReports, color: "text-yellow-600" },
                { icon: CheckCircle2, label: "Selesai", value: completedReports, color: "text-green-600" },
                { icon: CircleX, label: "Ditolak", value: rejectedReports, color: "text-red-600" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      py-1 sm:py-2
                    "
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon size={16} className="sm:size-[18px]" />
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </div>
                    <span className={`font-bold text-sm sm:text-base ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">
          {user?.role === "superadmin" ? (
            /* SUPERADMIN ACCESS */
            <div className="
              bg-white
              rounded-2xl sm:rounded-[32px]
              p-5 sm:p-6 md:p-8
              shadow-sm
              border
              border-slate-100
            ">
              <div className="mb-5 sm:mb-6 md:mb-8">
                <h2 className="
                  text-2xl sm:text-3xl
                  font-black
                  text-slate-800
                ">
                  Pengingat Hak Akses
                </h2>
                <p className="
                  text-slate-500
                  mt-1 sm:mt-2
                  text-sm sm:text-base
                ">
                  Anda memiliki akses penuh terhadap sistem
                </p>
              </div>

              <div className="
                bg-[#F4F7F6]
                rounded-2xl sm:rounded-[28px]
                p-5 sm:p-6 md:p-8
              ">
                <div className="
                  flex
                  items-center
                  gap-2 sm:gap-3
                  mb-4 sm:mb-5 md:mb-6
                ">
                  <Crown size={22} className="sm:size-[28px] text-[#004D4D]" />
                  <h3 className="
                    text-xl sm:text-2xl
                    font-black
                    text-[#004D4D]
                  ">
                    Super Administrator
                  </h3>
                </div>

                <ul className="
                  space-y-3 sm:space-y-4 md:space-y-5
                  text-slate-700
                  text-sm sm:text-base
                ">
                  <li>• Mengakses seluruh laporan masyarakat</li>
                  <li>• Mengelola akun administrator</li>
                  <li>• Mengelola kategori laporan</li>
                  <li>• Monitoring aktivitas sistem</li>
                  <li>• Memiliki akses penuh terhadap website</li>
                </ul>
              </div>
            </div>
          ) : (
            /* REPORTS LIST */
            <div className="
              bg-white
              rounded-2xl sm:rounded-[32px]
              p-5 sm:p-6 md:p-8
              shadow-sm
              border
              border-slate-100
            ">
              <div className="mb-5 sm:mb-6 md:mb-8">
                <h2 className="
                  text-2xl sm:text-3xl
                  font-black
                  text-slate-800
                ">
                  {user?.role === "user" ? "Laporan Saya" : "Laporan Terbaru"}
                </h2>
                <p className="
                  text-slate-500
                  mt-1 sm:mt-2
                  text-sm sm:text-base
                ">
                  {user?.role === "user"
                    ? "Daftar laporan yang telah Anda buat"
                    : "Monitoring laporan masyarakat"}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {visibleReports.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 md:py-20">
                    <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 md:mb-5">
                      📭
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-700">
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
                        rounded-2xl sm:rounded-[32px]
                        overflow-hidden
                        hover:shadow-lg
                        transition
                      "
                    >
                      {report.image && (
                        <img
                          src={report.image}
                          alt={report.header}
                          className="
                            w-full
                            h-[200px] sm:h-[240px] md:h-[280px]
                            object-cover
                          "
                        />
                      )}

                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="
                          flex
                          flex-col
                          sm:flex-row
                          items-start
                          justify-between
                          gap-3 sm:gap-4 md:gap-5
                        ">
                          <div className="flex-1 min-w-0 w-full">
                            <h2 className="
                              text-xl sm:text-2xl
                              font-black
                              text-slate-800
                              break-words
                            ">
                              {report.header}
                            </h2>
                            <div className="
                              flex
                              items-start
                              gap-1.5 sm:gap-2
                              mt-2 sm:mt-3
                              text-slate-500
                              text-xs sm:text-sm
                            ">
                              <MapPin size={14} className="sm:size-[15px] shrink-0 mt-0.5" />
                              <p className="line-clamp-2 break-words flex-1">
                                {report.location}
                              </p>
                            </div>
                          </div>

                          <span className="
                            bg-[#DFF6F3]
                            text-[#004D4D]
                            px-3 py-1.5 sm:px-4 sm:py-2
                            rounded-full
                            text-xs sm:text-sm
                            font-semibold
                            whitespace-nowrap
                            shrink-0
                            self-start
                          ">
                            {report.status}
                          </span>
                        </div>

                        <p className="
                          text-slate-600
                          leading-relaxed
                          mt-4 sm:mt-5
                          text-sm sm:text-base
                          line-clamp-3
                        ">
                          {report.body}
                        </p>

                        <div className="
                          mt-4 sm:mt-5 md:mt-6
                          flex
                          flex-col
                          sm:flex-row
                          items-start
                          sm:items-center
                          justify-between
                          gap-3 sm:gap-4
                        ">
                          <span className="
                            text-xs sm:text-sm
                            text-slate-500
                          ">
                            {new Date(report.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>

                          <button
                            onClick={() =>
                              router.push(`${currentRole.detailRoute}/${report.id}?from=profile`)
                            }
                            className="
                              bg-[#004D4D]
                              hover:bg-[#006666]
                              text-white
                              px-4 py-2.5 sm:px-5 sm:py-3
                              rounded-xl sm:rounded-2xl
                              transition
                              font-medium
                              flex
                              items-center
                              gap-2
                              w-full
                              sm:w-auto
                              justify-center
                              active:scale-[0.98]
                            "
                          >
                            <Eye size={16} className="sm:size-[18px]" />
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

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-50
          p-4
        ">
          <div className="
            bg-white
            w-full
            max-w-lg
            rounded-2xl sm:rounded-[32px]
            p-5 sm:p-6 md:p-8
            shadow-xl
            mx-4
            sm:mx-0
          ">
            <h2 className="
              text-2xl sm:text-3xl
              font-black
              text-slate-800
            ">
              Edit Profil
            </h2>

            <div className="mt-5 sm:mt-6 md:mt-8 space-y-4 sm:space-y-5">
              <div>
                <label className="text-xs sm:text-sm text-slate-500">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full
                    mt-1.5 sm:mt-2
                    border
                    border-slate-200
                    rounded-xl sm:rounded-2xl
                    px-3 py-2.5 sm:px-4 sm:py-3
                    text-sm sm:text-base
                    outline-none
                    focus:border-[#004D4D]
                    focus:ring-1
                    focus:ring-[#004D4D]
                  "
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-slate-500">Password Lama</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="
                    w-full
                    mt-1.5 sm:mt-2
                    border
                    border-slate-200
                    rounded-xl sm:rounded-2xl
                    px-3 py-2.5 sm:px-4 sm:py-3
                    text-sm sm:text-base
                    outline-none
                    focus:border-[#004D4D]
                    focus:ring-1
                    focus:ring-[#004D4D]
                  "
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm text-slate-500">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="
                    w-full
                    mt-1.5 sm:mt-2
                    border
                    border-slate-200
                    rounded-xl sm:rounded-2xl
                    px-3 py-2.5 sm:px-4 sm:py-3
                    text-sm sm:text-base
                    outline-none
                    focus:border-[#004D4D]
                    focus:ring-1
                    focus:ring-[#004D4D]
                  "
                />
              </div>
            </div>

            <div className="
              flex
              flex-col-reverse
              sm:flex-row
              justify-end
              gap-2 sm:gap-3
              mt-6 sm:mt-7 md:mt-8
            ">
              <button
                onClick={() => setShowEditModal(false)}
                className="
                  px-4 py-2.5 sm:px-5 sm:py-3
                  rounded-xl sm:rounded-2xl
                  border
                  border-slate-300
                  text-sm sm:text-base
                  hover:bg-slate-50
                  transition
                "
              >
                Batal
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="
                  px-4 py-2.5 sm:px-5 sm:py-3
                  rounded-xl sm:rounded-2xl
                  bg-[#004D4D]
                  text-white
                  font-semibold
                  text-sm sm:text-base
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  hover:bg-[#006666]
                  transition
                  active:scale-[0.98]
                "
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </RoleLayout>
);
}

