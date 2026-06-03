"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Sidebar from "./Sidebar"

export default function MobileSidebar({
  role,
}) {
  const [open, setOpen] =
    useState(false)

  return (
    <>
      <button
        suppressHydrationWarning
        onClick={() => setOpen(true)}
        className="p-3 rounded-xl bg-white shadow-sm border"
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="
              fixed
              inset-0
              bg-black/50
              z-40
            "
            onClick={() =>
              setOpen(false)
            }
          />

          {/* Drawer */}
          <div
            className="
              fixed
              left-0
              top-0
              z-50
              h-screen
              w-[260px]
            "
          >
            <button
              onClick={() =>
                setOpen(false)
              }
              className="
                absolute
                top-4
                right-4
                z-[60]
                bg-white
                rounded-full
                p-2
                shadow
              "
            >
              <X size={18} />
            </button>

            <Sidebar 
            role={role}
            mobile={true} 
            />
          </div>
        </>
      )}
    </>
  )
}