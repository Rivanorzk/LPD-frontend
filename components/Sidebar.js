"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { menuConfig } from "./menuConfig"

export default function Sidebar({
  role,
  mobile = false,
}) {
  const pathname =
    usePathname()

  const config =
    menuConfig[role]

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
                  gap-3
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
                <Icon size={20} />

                {menu.name}
              </Link>
            )
          }
        )}
      </nav>
    </aside>
  )
}