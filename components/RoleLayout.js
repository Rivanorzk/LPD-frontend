"use client"

import Sidebar from "@/components/Sidebar"

export default function RoleLayout({
  role,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <Sidebar role={role} />

      <main className="flex-1 lg:ml-[260px] p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}