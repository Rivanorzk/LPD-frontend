import Sidebar from "@/components/Sidebar"
import MobileSidebar from "@/components/MobileSidebar"

export default function UserLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar role="user" />
      </div>

      <main
        className="
          flex-1
          lg:ml-[260px]
          p-4
          lg:p-8
        "
      >
        {/* Header Mobile */}
        <div className="lg:hidden mb-4">
          <MobileSidebar role="user" />
        </div>

        {children}
      </main>

    </div>
  )
}