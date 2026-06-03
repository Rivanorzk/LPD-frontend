"use client"

import Sidebar from "@/components/Sidebar"
import MobileSidebar from "@/components/MobileSidebar"

export default function RoleLayout({
  children,
}) {
  const role =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("user") || "{}"
        )?.role || "user"
      : "user"

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      <main
        className="
          flex-1
          lg:ml-[260px]
          p-4
          lg:p-8
        "
      >
        <div className="lg:hidden mb-4">
          <MobileSidebar role={role} />
        </div>

        {children}
      </main>
    </div>
  )
}