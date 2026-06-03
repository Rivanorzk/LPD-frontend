"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import api from "@/lib/api"

import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  FolderKanban,
  User,
  MessageCircle,
} from "lucide-react"

import Image from "next/image"

import {
  useEffect,
  useState,
} from "react"

export default function NavbarAdmin() {

  const pathname =
    usePathname()


  const [unreadCount, setUnreadCount] =
    useState(() => {

      if (typeof window === "undefined") {
        return 0
      }

      return Number(
        localStorage.getItem(
          "unread_chat"
        ) || 0
      )
    })


  useEffect(() => {

    const fetchUnread =
      async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

        const response =
          await api.get(
            "/users/superadmins",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const totalUnread =
          response.data.reduce(
            (total, item) =>
              total +
              Number(
                item.unread_count || 0
              ),
            0
          )

        setUnreadCount(
          totalUnread
        )

      } catch (error) {

        console.log(error)
      }
    }

    fetchUnread()


    const updateUnread =
      () => {

      const latest =
        Number(
          localStorage.getItem(
            "unread_chat"
          ) || 0
        )

      setUnreadCount(latest)
    }

    window.addEventListener(
      "chat_notification",
      updateUnread
    )

    return () => {

      window.removeEventListener(
        "chat_notification",
        updateUnread
      )
    }

  }, [])

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Verifikasi",
      icon: ShieldCheck,
      path: "/admin/verifikasi",
    },
    {
      name: "Laporan",
      icon: FileText,
      path: "/admin/report",
    },
    {
      name: "Kategori",
      icon: FolderKanban,
      path: "/admin/categories",
    },
    {
      name: "Chat",
      icon: MessageCircle,
      path: "/admin/chat",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  return (
    <aside
      className="w-[260px] bg-[#004D4D] text-white flex flex-col px-5 py-8 fixed h-screen">

      <div className="mb-4 flex justify-center">
        <Image
          src="/admin.png"
          width={250}
          height={120}
          alt="Logo"
          priority
        />
      </div>

      <nav className="space-y-2">

        {menus.map(
          (menu, index) => {

          const Icon =
            menu.icon

          const isActive =
            pathname.startsWith(
              menu.path
            )

          return (
            <Link
              key={index}
              href={menu.path}
              className={`flex items-center justify-between px-4 py-4 rounded-2xl transition font-medium
                ${
                  isActive
                    ? "bg-white text-[#004D4D]"
                    : "hover:bg-[#0A5F5F]"
                }
              `}
            >

              <div className="flex items-center gap-3">

                <div className="relative">

                  <Icon size={20} />

                  {menu.name === "Chat" &&
                    unreadCount > 0 && (

                    <span
                      className="absolute -top-2 -right-3  min-w-[20px]  h-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                {menu.name}

              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
