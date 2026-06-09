"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  Search,
  MessageCircle,
} from "lucide-react"

import { useRouter } from "next/navigation"
import { socket } from "@/lib/socket"
import api from "@/lib/api"

export default function ChatPage() {

  const router = useRouter()

  const [users, setUsers] =
    useState([])

  const [search, setSearch] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

  const fetchUsers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        const [
          usersResponse,
          unreadResponse,
        ] = await Promise.all([

          api.get(
            "/users/superadmins",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          api.get(
            "/chat/unread/admin",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

        ])

        const unreadMap =
          unreadResponse.data.reduce(
            (acc, item) => {

              acc[
                item.sender_id
              ] =
                item.unread_count

              return acc

            },
            {}
          )

        const mergedUsers =
          usersResponse.data.map(
            (user) => ({
              ...user,

              unread_count:
                unreadMap[
                  user.id
                ] || 0,
            })
          )

        setUsers(
          mergedUsers
        )

        window.dispatchEvent(
          new Event(
            "chat_notification"
          )
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

  fetchUsers()

}, [])

  const filteredUsers =
    users.filter((item) =>
      item.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  useEffect(() => {

    const handleReceiveMessage =
      (data) => {

        const fromSuperadmin =
          data.sender_role ===
          "superadmin"

        if (!fromSuperadmin) {
          return
        }

        setUsers((prev) => {

          const updated =
            prev.map((user) => {

              if (
                Number(user.id) ===
                Number(data.sender_id)
              ) {

                return {
                  ...user,
                  unread_count:
                    Number(
                      user.unread_count || 0
                    ) + 1,
                }
              }

              return user
            })

          const totalUnread =
            updated.reduce(
              (total, item) =>
                total +
                Number(
                  item.unread_count || 0
                ),
              0
            )

          localStorage.setItem(
            "unread_chat",
            totalUnread
          )

          window.dispatchEvent(
            new Event(
              "chat_notification"
            )
          )

          return updated
        })
      }

    socket.on(
      "receive_message",
      handleReceiveMessage
    )

    return () => {

      socket.off(
        "receive_message",
        handleReceiveMessage
      )
    }

  }, [])


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

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
        Chat Superadmin
      </h1>

      <p className="text-white/80 mt-4 text-base lg:text-lg">
        Hubungi superadmin untuk koordinasi internal.
      </p>

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
          placeholder="Cari superadmin..."
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

    {/* USER LIST */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-8">

      {filteredUsers.length === 0 ? (

        <div className="col-span-full bg-white rounded-[32px] p-10 lg:p-16 text-center border border-slate-100 shadow-sm">

          <div className="text-7xl mb-5">
            💬
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-800">
            Tidak Ada Superadmin
          </h2>

          <p className="text-slate-500 mt-4">
            Belum ada data superadmin.
          </p>

        </div>

      ) : (

        filteredUsers.map((user) => (

          <div
            key={user.id}
            className="bg-white rounded-[32px] p-5 lg:p-8 shadow-sm border border-slate-100"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="w-16 h-16 rounded-full bg-[#DFF6F3] flex items-center justify-center text-2xl">
                👤
              </div>

              <span className="bg-[#DFF6F3] text-[#004D4D] px-4 py-2 rounded-full text-sm font-semibold">
                Superadmin
              </span>

            </div>

            <h2 className="text-xl lg:text-2xl font-black text-slate-800 mt-6">
              {user.username}
            </h2>

            <p className="text-slate-500 mt-3">
              Superadmin sistem pengaduan masyarakat.
            </p>

            <div className="relative mt-8">

              {Number(user.unread_count) > 0 && (

                <span className="absolute -top-2 -right-2 min-w-[24px] h-[24px] px-2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center z-10">

                  {user.unread_count}

                </span>
              )}

              <button
                onClick={() =>
                  router.push(
                    `/admin/chat/${user.id}`
                  )
                }
                className="w-full bg-[#004D4D] hover:bg-[#006666] text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >

                <MessageCircle size={20} />

                Mulai Chat

              </button>

            </div>

          </div>

        ))
      )}

    </div>

  </div>
)
}

