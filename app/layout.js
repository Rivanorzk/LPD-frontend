import "./globals.css"
import "leaflet/dist/leaflet.css"

export const metadata = {
  title: "LPD",
  description: "Layanan Pengaduan Depok",
}

export default function RootLayout({
  children,
}) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  )
}