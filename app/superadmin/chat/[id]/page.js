"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  useParams,
} from "next/navigation"

import NavbarSuperAdmin from "@/components/NavbarSuperAdmin"

import {
  SendHorizonal,
} from "lucide-react"

import { socket } from "@/lib/socket"
import api from "@/lib/api"

export default function ChatDetailPage() {

  const params = useParams()

  const messagesEndRef =
    useRef(null)

  const [messages, setMessages] =
    useState([])

  const [message, setMessage] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const currentUser =
  useMemo(() => {

    if (typeof window === "undefined") {
      return null
    }

    const user =
      localStorage.getItem("user")

    if (!user) {
      return null
    }

    try {
      return JSON.parse(user)
    } catch (error) {
      console.log(error)
      return null
    }

  }, [])


useEffect(() => {

  const fetchMessages =
    async () => {

      try {

        const token =
          localStorage.getItem("token")

        const response =
          await api.get(
            `/chat/${params.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )
        
      setMessages(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  const markAsRead =
    async () => {

      try {

        const token =
          localStorage.getItem("token")

        await api.patch(
          `/chat/read/${params.id}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      } catch (error) {
        console.log(error)
      }
    }

  if (params.id) {

    fetchMessages()

    markAsRead()
  }

}, [params.id])


useEffect(() => {

  if (!currentUser?.id) return

  socket.emit(
    "join_room",
    currentUser.id
  )

  const handleReceiveMessage =
    (data) => {

      const isCurrentChat =
        (
          Number(data.sender_id) ===
            Number(params.id)

          &&

          Number(data.receiver_id) ===
            Number(currentUser?.id)
        )

        ||

        (
          Number(data.sender_id) ===
            Number(currentUser?.id)

          &&

          Number(data.receiver_id) ===
            Number(params.id)
        )

      if (!isCurrentChat) {
        return
      }

      setMessages((prev) => {

        const exists =
        prev.some(
          (item) =>
            Number(item.id) ===
            Number(data.id)
        )

        if (exists) return prev

        return [
          ...prev,
          data,
        ]
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

}, [currentUser,
    params.id
  ])



  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      })

  }, [messages])

const sendMessage =
  async () => {

    if (!message.trim()) return

    try {

      const token =
        localStorage.getItem("token")



















      await api.post(
        "/chat",
        {
          receiver_id:
            params.id,

          message,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      setMessage("")

    } catch (error) {
      console.log(error)
    }
  }

  if (!currentUser?.id) {
  return (
    <div className="p-10">
      User tidak ditemukan
    </div>
  )
}

  if (!params?.id) {
    return (
      <div className="p-10">
        Chat ID tidak ditemukan
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F4F7F6]">

        <NavbarSuperAdmin />

        <main className="ml-[260px] flex-1 p-10">

          <div className="bg-white h-[700px] rounded-[32px] animate-pulse" />

        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7F6] overflow-hidden">

      <NavbarSuperAdmin />

      <main className="ml-[260px] flex-1 p-8">

        {/* HEADER */}
        <div className="
          bg-gradient-to-r
          from-[#004D4D]
          to-[#006666]
          rounded-[32px]
          p-8
          text-white
          shadow-xl
        ">

          <h1 className="text-4xl font-black">
            Chat Admin
          </h1>

          <p className="text-white/80 mt-3">
            Komunikasi internal dengan admin.
          </p>
        </div>

        {/* CHAT */}
        <div
          className="
            mt-8
            bg-white
            rounded-[32px]
            border
            border-slate-100
            shadow-sm
            flex
            flex-col
            h-[75vh]
          "
        >

          {/* MESSAGE */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-8
              space-y-5
            "
          >

            {messages.length === 0 ? (

              <div className="
                h-full
                flex
                items-center
                justify-center
                text-slate-400
              ">
                Belum ada pesan
              </div>

            ) : (

              messages.map(
                (item, index) => {

                 const isMine =
                  Number(item.sender_id) ===
                  Number(currentUser?.id)

                  return (
                    <div
                      key={item.id || index}
                      className={`
                        flex
                        ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >

                      <div
                        className={`
                          max-w-[70%]
                          px-5
                          py-4
                          rounded-3xl
                          text-sm
                          shadow-sm

                          ${
                            isMine
                              ? "bg-[#004D4D] text-white rounded-br-md"
                              : "bg-slate-100 text-slate-700 rounded-bl-md"
                          }
                        `}
                      >

                        <p className="leading-relaxed">
                          {item.message}
                        </p>

                        <p
                          className={`
                            text-xs
                            mt-3

                            ${
                              isMine
                                ? "text-white/70"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )
                }
              )
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="
            border-t
            border-slate-100
            p-5
            flex
            items-center
            gap-4
          ">

            <input
              type="text"
              placeholder="Tulis pesan..."
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {
                  sendMessage()
                }
              }}
              className="
                flex-1
                px-5
                py-4
                rounded-2xl
                bg-slate-100
                border
                border-slate-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#004D4D]
              "
            />

            <button
              onClick={sendMessage}
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#004D4D]
                hover:bg-[#006666]
                text-white
                flex
                items-center
                justify-center
                transition
              "
            >

              <SendHorizonal
                size={22}
              />

            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
