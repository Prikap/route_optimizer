import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, Route } from '../types';
import { Trash2 } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  locations: Location[];
  route: Route | null;
  onAddLocation: (lat: number, lng: number) => void;
  onRemoveLocation: (id: string) => void;
}

function MapClickHandler({ onAddLocation }: { onAddLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAddLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function Map({ locations, route, onAddLocation, onRemoveLocation }: MapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const center: [number, number] = [51.505, -0.09]; // Default to London

  // Fit bounds when locations change
  if (map && locations.length > 0) {
    const bounds = new L.LatLngBounds(locations.map(loc => [loc.lat, loc.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-20 bg-white px-4 py-2 rounded-lg shadow-md text-sm">
        Click on the map to add a location
      </div>
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-[600px] rounded-lg shadow-lg"
        ref={setMap}
      >
        <MapClickHandler onAddLocation={onAddLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            title={location.name}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">{location.name}</div>
                <div className="text-sm text-gray-600">Stop #{index + 1}</div>
                <button
                  onClick={() => onRemoveLocation(location.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={14} />
                  Remove Stop
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {route && (
          <>
            <Polyline
              positions={route.locations.map((loc) => [loc.lat, loc.lng])}
              pathOptions={{
                color: '#3B82F6',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round'
              }}
            />
            <Polyline
              positions={route.locations.map((loc) => [loc.lat, loc.lng])}
              pathOptions={{
                color: '#1D4ED8',
                weight: 2,
                opacity: 0.5
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}