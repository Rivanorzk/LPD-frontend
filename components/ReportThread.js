"use client"

import { Heart, MessageCircle, MapPin, Clock3 } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function ReportThread({
  reports = [],
  from = "dashboard",
  setReports,
}) {
  const router = useRouter()

  const handleLike = async (e, reportId) => {
    e.stopPropagation()

    try {
      const token = localStorage.getItem("token")

      const response = await api.post(
        "/like",
        {
          report_id: reportId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const liked = response.data.liked

      setReports((prev) =>
        prev.map((item) => {
          if (item.id === reportId) {
            const alreadyLiked = item.liked_by_user

            return {
              ...item,
              liked_by_user: !alreadyLiked,
              total_likes: alreadyLiked
                ? Number(item.total_likes || 0) - 1
                : Number(item.total_likes || 0) + 1,
            }
          }

          return item
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Diproses":
        return "bg-yellow-100 text-yellow-700"

      case "Selesai":
        return "bg-green-100 text-green-700"

      case "Ditolak":
        return "bg-red-100 text-red-700"

      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {reports.map((report) => (
        <div
          key={report.id}
          onClick={() =>
            router.push(`/user/report/${report.id}?from=${from}`)
          }
          className="
            bg-white
            rounded-2xl sm:rounded-[32px]
            border border-slate-100
            shadow-sm
            cursor-pointer
            overflow-hidden
            hover:shadow-xl
            transition
          "
        >
          {/* HEADER */}
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div
                  className="
                    w-12 h-12
                    sm:w-16 sm:h-16
                    rounded-full
                    bg-[#DFF6F3]
                    overflow-hidden
                    flex
                    items-center
                    justify-center
                    text-2xl sm:text-3xl
                    shrink-0
                  "
                >
                  {report?.profile_image ? (
                    <img
                      src={report.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-base sm:text-lg text-slate-800 truncate">
                    {report.username}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock3 size={14} />
                      <span>
                        {new Date(report.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">
                        {report.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`
                  self-start
                  sm:self-auto
                  px-3 py-1.5
                  sm:px-4 sm:py-2
                  rounded-full
                  text-xs sm:text-sm
                  font-semibold
                  ${getStatusColor(report.status)}
                `}
              >
                {report.status || "Menunggu"}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-4 sm:px-6 pb-6">
            <h1
              className="
                text-lg
                sm:text-xl
                lg:text-2xl
                font-bold
                text-slate-800
                mb-3
                leading-snug
              "
            >
              {report.header}
            </h1>

            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              {report.body}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5 mb-5">
              <span
                className="
                  bg-[#DFF6F3]
                  text-[#004D4D]
                  px-3 py-1.5
                  sm:px-4 sm:py-2
                  rounded-full
                  text-xs sm:text-sm
                  font-medium
                "
              >
                {report.nama_kategori}
              </span>
            </div>

            {report.image && (
              <img
                src={report.image}
                alt={report.header}
                className="
                  w-full
                  h-52
                  sm:h-72
                  lg:h-[420px]
                  object-cover
                  rounded-2xl
                  sm:rounded-3xl
                  border border-slate-100
                "
              />
            )}
          </div>

          {/* FOOTER */}
          <div
            className="
              border-t border-slate-100
              px-4 sm:px-6
              py-4 sm:py-5
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4 sm:gap-6
                text-slate-500
                text-sm sm:text-base
              "
            >
              <button
                onClick={(e) => handleLike(e, report.id)}
                className={`flex items-center gap-2 transition ${
                  report.liked_by_user
                    ? "text-red-500"
                    : "text-slate-500 hover:text-red-500"
                }`}
              >
                <Heart
                  size={20}
                  fill={
                    report.liked_by_user
                      ? "currentColor"
                      : "none"
                  }
                />

                <span>
                  {report.total_likes || 0} Likes
                </span>
              </button>

              <button className="flex items-center gap-2 hover:text-teal-700 transition">
                <MessageCircle size={20} />
                <span>
                  {report.total_comments || 0} Komentar
                </span>
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()

                router.push(
                  `/user/report/${report.id}?from=${from}`
                )
              }}
              className="
                w-full
                sm:w-auto
                bg-[#004D4D]
                hover:bg-[#006666]
                text-white
                px-5
                py-3
                rounded-2xl
                font-medium
                transition
                text-center
              "
            >
              Lihat Thread
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}