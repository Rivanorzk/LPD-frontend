"use client"

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet"

import { useState } from "react"

import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function LocationMarker({ setPosition }) {
  const [position, setMarkerPosition] =
    useState(null)

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng


      const isInsideDepok =
        lat >= -6.52 &&
        lat <= -6.30 &&
        lng >= 106.68 &&
        lng <= 106.90

      if (!isInsideDepok) {
        alert(
          "Lokasi harus berada di wilayah Depok"
        )

        return
      }

      setMarkerPosition(e.latlng)
      setPosition(e.latlng)
    },
  })

  return position ? (
    <Marker position={position} />
  ) : null
}

export default function LocationPicker({
  setPosition,
}) {
  return (
    <MapContainer
      center={[-6.4025, 106.7942]}
      zoom={12}
      minZoom={11}
      maxBounds={[
        [-6.52, 106.68], // southwest
        [-6.30, 106.90], // northeast
      ]}
      maxBoundsViscosity={1.0}
      className="h-[400px] w-full rounded-3xl z-0"
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        setPosition={setPosition}
      />
    </MapContainer>
  )
}