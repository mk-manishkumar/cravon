"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function DraggableMarker({ lat, lng, setPosition }: Readonly<{ lat: number; lng: number; setPosition?: (lat: number, lng: number) => void }>) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (setPosition) {
        setPosition(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  // Pan to marker when position changes externally
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15);
    }
  }, [lat, lng, map]);

  return (
    <Marker
      position={[lat, lng]}
      draggable={!!setPosition}
      eventHandlers={setPosition ? {
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos.lat, pos.lng);
        },
      } : {}}
    />
  );
}

interface MapWidgetProps {
  lat?: number;
  lng?: number;
  setCoordinates?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export default function MapWidget({ lat, lng, setCoordinates, readOnly = false }: Readonly<MapWidgetProps>) {
  const position: [number, number] = lat && lng ? [lat, lng] : [40.7128, -74.006];
  const zoom = lat && lng ? 15 : 3;

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      style={{ width: "100%", height: "100%", zIndex: 0 }} 
      scrollWheelZoom={!readOnly} 
      className="z-0" 
      dragging={!readOnly}
      zoomControl={!readOnly}
      attributionControl={!readOnly}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' />
      {Boolean(lat) && Boolean(lng) && lat !== undefined && lng !== undefined && <DraggableMarker lat={lat} lng={lng} setPosition={setCoordinates} />}
    </MapContainer>
  );
}
