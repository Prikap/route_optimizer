export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  locations: Location[];
  distance: number;
  duration: number;
  transportMode: TransportMode;
}

export type TransportMode = 'CAR' | 'TRUCK' | 'BIKE' | 'WALK';

export interface VehicleOption {
  id: TransportMode;
  name: string;
  speed: number; // km/h
  icon: string;
}