"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import {
  MapPin,
  Clock3,
  Heart,
  MessageCircle,
  Share2,
  SendHorizonal,
  File,
  MoreVertical,
  Trash2,
  Pencil,
} from "lucide-react"

export default function ReportDetailPage() {
  const params = useParams()

  const [report, setReport] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [editingId, setEditingId] =
  useState(null)
  const [editText, setEditText] =
    useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      const userData =
        localStorage.getItem("user")

      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    loadUser()
  }, [])
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token")

        const [reportResponse, commentResponse] =
          await Promise.all([
            api.get(
              `/report/${params.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            api.get(
              `/comment/report/${params.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ])

        console.log("REPORT:", reportResponse.data)
        console.log("COMMENTS:", commentResponse.data)

        setReport(reportResponse.data)
        setComments(commentResponse.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDetail()
    }
  }, [params.id])

  const handleLike = async () => {
  try {
    const token = localStorage.getItem("token")

    const response = await api.post(
      "/like",
      {
        report_id: report.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const liked = response.data.liked

    setReport((prev) => ({
      ...prev,

      liked_by_user: liked,

      total_likes: liked
        ? Number(prev.total_likes || 0) + 1
        : Number(prev.total_likes || 0) - 1,
    }))
  } catch (error) {
    console.log(error)
  }
}

  const handleComment = async () => {
    if (!comment.trim()) return

    try {
      setSending(true)

      const token = localStorage.getItem("token")

      await api.post(
        "/comment",
        {
          report_id: params.id,
          body: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const response = await api.get(
        `/comment/report/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setComments(response.data)
      setReport((prev) => ({
        ...prev,
        total_comments:
          Number(prev.total_comments || 0) + 1,
      }))
      setComment("")
    } catch (error) {
      console.log(error)
    } finally {
      setSending(false)
    }
  }

  const handleEditComment = async (
  commentId
) => {
  try {
    const token =
      localStorage.getItem("token")

    await api.put(
      `/comment/${commentId}`,
      {
        body: editText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const response = await api.get(
      `/comment/report/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setComments(response.data)

    setEditingId(null)
    setEditText("")

  } catch (error) {
    console.log(error)
  }
}

const handleDeleteComment = async (
  commentId
) => {
  if (
    !window.confirm(
      "Hapus komentar?"
    )
  ) {
    return
  }

  try {
    const token =
      localStorage.getItem("token")

    await api.delete(
      `/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const response = await api.get(
      `/comment/report/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setComments(response.data)

    setReport((prev) => ({
      ...prev,
      total_comments:
        Number(prev.total_comments || 0) - 1,
    }))

  } catch (error) {
    console.log(error)
  }
}

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "dalam proses":
        return "bg-yellow-100 text-yellow-700"

      case "selesai":
        return "bg-green-100 text-green-700"

      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const handlePDF = async () => {
  try {
    const response =
      await api.get(
        `/report/pdf/${params.id}`,
        {
          responseType: "blob",
        }
      )

    const url =
      window.URL.createObjectURL(
        response.data
      )

    const a =
      document.createElement("a")

    a.href = url
    a.download =
      `laporan-${params.id}.pdf`

    a.click()

    window.URL.revokeObjectURL(url)

  }
    catch (error) {
    console.log("ERROR:", error)
    console.log("STATUS:", error.response.status)
    console.log("DATA:", error.response.data)
  }
}
 

  if (loading) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="bg-white h-[600px] rounded-[32px] animate-pulse" />
    </div>
  )
}

 return (
  <div className="overflow-x-hidden">

    <div className="max-w-5xl mx-auto">

      {/* THREAD CARD */}
      <div className="bg-white rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-sm border border-slate-100">

        {/* TOP */}
        <div className="p-5 sm:p-6 lg:p-8 pb-6">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

            <div className="flex items-center gap-4 sm:gap-5">

              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#DFF6F3] overflow-hidden flex items-center justify-center text-2xl sm:text-3xl">

                {report?.profile_image ? (

                  <img
                    src={report?.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  "👤"

                )}

              </div>

              <div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  {report?.username}
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-slate-500 text-sm">

                  <div className="flex items-center gap-2">

                    <Clock3 size={15} />

                    {report?.created_at
                      ? new Date(
                          report.created_at
                        ).toLocaleString(
                          "id-ID"
                        )
                      : "-"}

                  </div>

                  <div className="flex items-center gap-2">

                    <MapPin size={15} />

                    {report?.location}

                  </div>

                </div>

              </div>

            </div>

           <div
              className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                report?.status
              )}`}
            >
              {report?.status || "Menunggu"}
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-8">

            <div className="flex items-center gap-3 mb-5 flex-wrap">

              <span className="bg-[#DFF6F3] text-[#004D4D] px-4 py-2 rounded-full text-sm font-semibold">

                {report?.nama_kategori}

              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 leading-tight mb-5">

              {report?.header}

            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed whitespace-pre-line">

              {report?.body}

            </p>

          </div>

        </div>

        {/* IMAGE */}
        {report?.image && (

          <div className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-8">

            <img
              src={report?.image}
              alt={report.header}
              className="w-full h-[220px] sm:h-[350px] lg:h-[550px] object-cover rounded-[24px] lg:rounded-[32px] border border-slate-100"
            />

          </div>

        )}

        {/* ACTIONS */}
        <div className="border-t border-slate-100 px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-slate-500">

            <button
              className={`flex items-center gap-2 transition ${
                report?.liked_by_user
                  ? "text-red-500"
                  : "text-slate-500 hover:text-red-500"
              }`}
              onClick={handleLike}
            >

              <Heart
                size={22}
                fill={
                  report?.liked_by_user
                    ? "currentColor"
                    : "none"
                }
              />

              <span>
                {report?.total_likes || 0}
                {" "}
                Likes
              </span>

            </button>

            <button className="flex items-center gap-2 hover:text-teal-700 transition">

              <MessageCircle size={22} />

              <span>
                {report?.total_comments || 0}
                {" "}
                Komentar
              </span>

            </button>

            <button
              onClick={handlePDF}
              className="flex items-center gap-2 hover:text-green-600 transition"
            >

              <File size={22} />

              <span>
                Export PDF
              </span>

            </button>

          </div>

        </div>

      </div>

      {/* COMMENT SECTION */}
      <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-sm border border-slate-100 mt-6 lg:mt-10 p-5 sm:p-6 lg:p-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Diskusi Warga
            </h2>

            <p className="text-slate-500 mt-2">
              Komentar dan dukungan masyarakat sekitar
            </p>

          </div>

          <div className="bg-[#DFF6F3] text-[#004D4D] px-5 py-3 rounded-2xl font-semibold self-start">

            {comments.length}
            {" "}
            Komentar

          </div>

        </div>

        {/* INPUT */}
        <div className="bg-[#F8FAFA] border border-slate-100 rounded-[24px] lg:rounded-[32px] p-4 sm:p-5 lg:p-6 mb-8 lg:mb-10">

          <textarea
            rows="4"
            placeholder="Tulis komentar atau dukungan Anda..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className="w-full bg-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400"
          />

          <div className="flex justify-stretch sm:justify-end mt-5">

            <button
              onClick={handleComment}
              disabled={sending}
              className="w-full sm:w-auto bg-[#004D4D] hover:bg-[#006666] text-white px-6 py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >

              <SendHorizonal size={18} />

              {sending
                ? "Mengirim..."
                : "Kirim Komentar"}

            </button>

          </div>

        </div>

        {/* COMMENTS */}
        <div className="space-y-6">

          {comments.length === 0 ? (

            <div className="text-center py-16">

              <div className="text-7xl mb-4">
                💬
              </div>

              <h3 className="text-2xl font-bold text-slate-700">
                Belum Ada Komentar
              </h3>

              <p className="text-slate-500 mt-3">
                Jadilah orang pertama yang berdiskusi.
              </p>

            </div>

          ) : (

            comments.map((item) => (
  <div
    key={item.id}
    className="bg-[#F8FAFA] border border-slate-100 rounded-[24px] lg:rounded-[32px] p-4 sm:p-5 lg:p-6"
  >

    <div className="flex items-start gap-3 sm:gap-5">

      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DFF6F3] overflow-hidden flex items-center justify-center text-xl sm:text-2xl shrink-0">

        {item?.image ? (
          <img
            src={item.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          "👤"
        )}

          </div>

          <div className="flex-1">

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-bold text-base sm:text-lg text-slate-800">
                  {item.username}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {item?.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString("id-ID")
                    : "-"}
                </p>

              </div>

              {user?.id === item.user_id && (
                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setEditingId(item.id)
                      setEditText(item.body)
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteComment(item.id)
                    }
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              )}

            </div>

            {editingId === item.id ? (

              <div className="mt-4">

                <textarea
                  value={editText}
                  onChange={(e) =>
                    setEditText(
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none"
                />

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() =>
                      handleEditComment(
                        item.id
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    Simpan
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditText("")
                    }}
                    className="bg-slate-200 px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>

                </div>

              </div>

            ) : (

              <p className="text-slate-700 leading-relaxed mt-5 whitespace-pre-line text-sm sm:text-base">
                {item.body}
              </p>

            )}

          </div>

        </div>

      </div>
    ))

          )}

        </div>

      </div>

    </div>

  </div>
)
}
