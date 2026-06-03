import {
  Home,
  Activity,
  Camera,
  Bell,
  User,
  LayoutDashboard,
  ShieldCheck,
  FileText,
  FolderKanban,
  Users,
  MessageCircle,
} from "lucide-react"

export const menuConfig = {
  user: {
    logo: "/logo.png",
    menus: [
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
    ],
  },

  admin: {
    logo: "/admin.png",
    menus: [
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
    ],
  },

  superadmin: {
    logo: "/superadmin.png",
    menus: [
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
    ],
  },
}