"use client"

import {
  Activity,
  Bell,
  Camera,
  Home,
  User,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"

import {
  usePathname,
  useSearchParams,
} from "next/navigation"

import {
  useEffect,
  useState,
} from "react"

import api from "@/lib/api"

export default function Navbar() {

  const pathname =
    usePathname()

  const searchParams =
    useSearchParams()

  const from =
    searchParams.get("from")

  const [unreadCount,
    setUnreadCount] =
    useState(0)

  const menus = [
    {
      name: "Home",
      icon: Home,
      path: "/user/dashboard",
    },

    {
      name: "Aktivitas",
      icon: Activity,
      path: "/user/activity",
    },

    {
      name: "Lapor",
      icon: Camera,
      path: "/user/report",
    },

    {
      name: "Notifikasi",
      icon: Bell,
      path: "/user/notifikasi",
    },

    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ]


  useEffect(() => {

    const fetchNotif =
      async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          )

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

        setUnreadCount(
          unread
        )

      } catch (error) {

        console.log(error)
      }
    }

    fetchNotif()

  }, [])


  const checkIsActive =
    (menu) => {


    if (from === "profile") {
      return menu.name === "Profile"
    }


    if (from === "dashboard") {
      return menu.name === "Home"
    }


    if (
      pathname === "/user/report"
    ) {
      return menu.name === "Lapor"
    }


    return pathname === menu.path
  }

  return (

    <aside className="fixed h-screen w-[260px] bg-[#004D4D] text-white px-5 py-8 flex flex-col">

      {/* LOGO */}
      <div className="
        mb-10 flex justify-center
      ">

        <Image
          src="/logo.png"
          width={180}
          height={120}
          alt="Logo"
          priority
        />

      </div>

      {/* MENU */}
      <nav className="space-y-2">

        {menus.map((menu, index) => {

          const Icon =
            menu.icon

          const isActive =
            checkIsActive(menu)

          return (

            <Link
              key={index}
              href={menu.path}
              className={`
                flex
                items-center
                justify-between
                px-4
                py-4
                rounded-2xl
                font-medium
                transition

                ${
                  isActive
                    ? "bg-[#DCE8E6] text-[#004D4D]"
                    : "hover:bg-[#0A5F5F]"
                }
              `}
            >

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="relative">

                  <Icon size={20} />

                  {menu.name ===
                    "Notifikasi" &&
                    unreadCount > 0 && (

                    <div className="
                      absolute
                      -top-1
                      -right-1
                      min-w-[16px]
                      h-4
                      px-1
                      rounded-full
                      bg-red-500
                      text-white
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    ">

                      {unreadCount}

                    </div>
                  )}
                </div>

                <span>

                  {menu.name}

                </span>

              </div>

            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

