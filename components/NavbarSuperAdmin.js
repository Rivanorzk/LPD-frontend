"use client"

import Link from "next/link"

import {
  usePathname,
} from "next/navigation"

import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileText,
  FolderKanban,
  Activity,
  Settings,
  User,
} from "lucide-react"
import Image from "next/image"

export default function NavbarSuperAdmin() {

  const pathname =
    usePathname()

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/superadmin/dashboard",
    },
    {
      name: "Kelola Admin",
      icon: ShieldCheck,
      path: "/superadmin/admins",
    },
    {
      name: "Kelola User",
      icon: Users,
      path: "/superadmin/users",
    },
    {
      name: "Semua Laporan",
      icon: FileText,
      path: "/superadmin/reports",
    },
    {
      name: "Kategori",
      icon: FolderKanban,
      path: "/superadmin/categories",
    },
    {
      name: "Audit Log",
      icon: Activity,
      path: "/superadmin/audit-log",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  return (
    <aside className="w-[260px] bg-[#004D4D] text-white fixed h-screen px-5 py-8 overflow-y-auto no-scrollbar">

      {/* LOGO */}
     <div className="mb-2 flex justify-center">
             <Image
               src="/superadmin.png"
               width={250}
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
            pathname.startsWith(menu.path)

          return (
            <Link
              key={index}
              href={menu.path}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-4
                rounded-2xl
                transition
                font-medium

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
        })}
      </nav>
    </aside>
  )
}

