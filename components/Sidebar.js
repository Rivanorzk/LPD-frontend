"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import api from "@/lib/api"
import { menuConfig } from "./menuConfig"

export default function Sidebar({
  role,
  mobile = false,
}) {
  const pathname =
    usePathname()

  const config =
    menuConfig[role]

  const [unreadNotif,
    setUnreadNotif] =
    useState(0)

  const [unreadChat,
  setUnreadChat] =
  useState(0)

  const [unreadAdminChat,
  setUnreadAdminChat] =
  useState(0)

  useEffect(() => {

   const fetchBadgeData =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        )

      if (!token) return

      // USER
      if (role === "user") {

        const response =
          await api.get(
            "/notifications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const unread =
          response.data.filter(
            (item) =>
              !item.is_read
          ).length

        setUnreadNotif(
          unread
        )

        return
      }

      // ADMIN & SUPERADMIN
      if (
        role === "admin" ||
        role === "superadmin"
      ) {

        const response =
          await api.get(
            "/chat/unread",
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

        if (role === "admin") {

          setUnreadChat(
            totalUnread
          )
        }

        if (
          role ===
          "superadmin"
        ) {

          setUnreadAdminChat(
            totalUnread
          )
        }
      }
      fetchBadgeData()

    } catch (error) {

      console.log(error)
    }
  }

    const updateChatBadge =
    () => {
      fetchBadgeData()
    }

  const updateAdminBadge =
    () => {
      fetchBadgeData()
    }

  const updateNotificationBadge =
    () => {
      fetchBadgeData()
    }

    window.addEventListener(
      "chat_notification",
      updateChatBadge
    )

    window.addEventListener(
      "admin_chat_notification",
      updateAdminBadge
    )
    window.addEventListener(
      "notifications_changed",
      updateNotificationBadge
    )

    return () => {

      window.removeEventListener(
        "chat_notification",
        updateChatBadge
      )

      window.removeEventListener(
        "admin_chat_notification",
        updateAdminBadge
      )

      window.removeEventListener(
        "notifications_changed",
        updateNotificationBadge
      )
    }

  }, [role])

  return (
    <aside
      className={
        mobile
          ? "h-screen w-[260px] bg-[#004D4D] text-white px-5 py-8"
          : "hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-[#004D4D] text-white px-5 py-8 flex-col"
      }
    >
      <div className="mb-8 flex justify-center">
        <Image
          src={config.logo}
          width={180}
          height={120}
          alt="Logo"
          priority
        />
      </div>

      <nav className="space-y-2">

        {config.menus.map(
          (menu) => {

            const Icon =
              menu.icon

            const isActive =
              pathname.startsWith(
                menu.path
              )

            return (

              <Link
                key={menu.path}
                href={menu.path}
                className={`
                  flex
                  items-center
                  justify-between
                  px-4
                  py-4
                  rounded-2xl
                  transition

                  ${
                    isActive
                      ? "bg-white text-[#004D4D]"
                      : "hover:bg-[#0A5F5F]"
                  }
                `}
              >

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <Icon
                      size={20}
                    />

                    {/* USER */}
                    {menu.name ===
                      "Notifikasi" &&
                      unreadNotif >
                        0 && (

                      <span
                        className="
                          absolute
                          -top-2
                          -right-3
                          min-w-[20px]
                          h-[20px]
                          px-1
                          rounded-full
                          bg-red-500
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {
                          unreadNotif
                        }
                      </span>
                    )}

                    {/* ADMIN */}
                    {menu.name ===
                      "Chat" &&
                      unreadChat >
                        0 && (

                      <span
                        className="
                          absolute
                          -top-2
                          -right-3
                          min-w-[20px]
                          h-[20px]
                          px-1
                          rounded-full
                          bg-red-500
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {
                          unreadChat
                        }
                      </span>
                    )}

                    {/* SUPERADMIN */}
                    {menu.name ===
                      "Kelola Admin" &&
                      unreadAdminChat >
                        0 && (

                      <span
                        className="
                          absolute
                          -top-2
                          -right-3
                          min-w-[20px]
                          h-[20px]
                          px-1
                          rounded-full
                          bg-red-500
                          text-white
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {
                          unreadAdminChat
                        }
                      </span>
                    )}

                  </div>

                  <span>
                    {menu.name}
                  </span>

                </div>

              </Link>
            )
          }
        )}

      </nav>
    </aside>
  )
}