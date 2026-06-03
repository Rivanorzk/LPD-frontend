export const roleConfig = {
  user: {
    title: "Pengguna",
    badge: "USER",
    gradient: "from-[#004D4D] to-[#006666]",
    detailRoute: "/user/report",
    emoji: "👤",
  },

  admin: {
    title: "Administrator",
    badge: "ADMIN",
    gradient: "from-slate-800 to-[#004D4D]",
    detailRoute: "/admin/report",
    emoji: "🛡️",
  },

  superadmin: {
    title: "Super Administrator",
    badge: "SUPERADMIN",
    gradient: "from-[#001F1F] to-[#004D4D]",
    detailRoute: "/superadmin/report",
    emoji: "👑",
  },
}