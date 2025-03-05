import * as turf from '@turf/turf';
import { Location, Route, TransportMode, VehicleOption } from '../types';

export const vehicleOptions: VehicleOption[] = [
  { id: 'CAR', name: 'Car', speed: 50, icon: '🚗' },
  { id: 'TRUCK', name: 'Truck', speed: 40, icon: '🚛' },
  { id: 'BIKE', name: 'Bike', speed: 15, icon: '🚲' },
  { id: 'WALK', name: 'Walk', speed: 5, icon: '🚶' },
];

function calculateDistance(from: Location, to: Location): number {
  const fromPoint = turf.point([from.lng, from.lat]);
  const toPoint = turf.point([to.lng, to.lat]);
  return turf.distance(fromPoint, toPoint);
}

function nearestNeighbor(locations: Location[]): Location[] {
  if (locations.length <= 2) return locations;

  const unvisited = [...locations.slice(1)];
  const route = [locations[0]];
  let current = locations[0];

  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let minDistance = calculateDistance(current, nearest);
    let nearestIndex = 0;

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(current, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = unvisited[i];
        nearestIndex = i;
      }
    }

    route.push(nearest);
    current = nearest;
    unvisited.splice(nearestIndex, 1);
  }

  return route;
}

export function optimizeRoute(locations: Location[], transportMode: TransportMode): Route {
  const vehicle = vehicleOptions.find(v => v.id === transportMode)!;
  const optimizedLocations = nearestNeighbor(locations);
  
  let totalDistance = 0;
  for (let i = 0; i < optimizedLocations.length - 1; i++) {
    totalDistance += calculateDistance(optimizedLocations[i], optimizedLocations[i + 1]);
  }

  const duration = (totalDistance / vehicle.speed) * 60; // Convert to minutes

  return {
    id: Date.now().toString(),
    locations: optimizedLocations,
    distance: totalDistance,
    duration: Math.round(duration),
    transportMode
  };
}