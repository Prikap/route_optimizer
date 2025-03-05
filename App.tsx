import React, { useState } from 'react';
import { Map } from './components/Map';
import { LocationList } from './components/LocationList';
import { LocationSearch } from './components/LocationSearch';
import { VehicleSelector } from './components/VehicleSelector';
import { Location, Route, TransportMode } from './types';
import { MapPin, RotateCw } from 'lucide-react';
import { optimizeRoute } from './services/routeOptimizer';
import { SearchResult } from './services/geocoding';

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>('CAR');

  const handleLocationSelect = (result: SearchResult) => {
    const newLocation: Location = {
      id: result.id,
      name: result.name,
      lat: result.lat,
      lng: result.lng
    };
    setLocations([...locations, newLocation]);
    setRoute(null);
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
    setRoute(null);
  };

  const handleAddLocation = (lat: number, lng: number) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: `Stop ${locations.length + 1}`,
      lat,
      lng
    };
    setLocations([...locations, newLocation]);
    setRoute(null);
  };

  const handleReorderLocations = (dragIndex: number, hoverIndex: number) => {
    const reorderedLocations = [...locations];
    const [draggedItem] = reorderedLocations.splice(dragIndex, 1);
    reorderedLocations.splice(hoverIndex, 0, draggedItem);
    setLocations(reorderedLocations);
    setRoute(null);
  };

  const handleUpdateLocationName = (id: string, name: string) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, name } : loc
    ));
  };

  const handleOptimizeRoute = () => {
    if (locations.length < 2) return;
    
    setIsOptimizing(true);
    try {
      const optimizedRoute = optimizeRoute(locations, transportMode);
      setRoute(optimizedRoute);
      setLocations(optimizedRoute.locations);
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Route Optimizer</h1>
          </div>
          <button
            onClick={handleOptimizeRoute}
            disabled={isOptimizing || locations.length < 2}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw className={isOptimizing ? 'animate-spin' : ''} size={18} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <LocationSearch onLocationSelect={handleLocationSelect} />
            </div>
            <Map 
              locations={locations} 
              route={route} 
              onAddLocation={handleAddLocation}
              onRemoveLocation={handleRemoveLocation}
            />
          </div>
          <div className="space-y-4">
            <VehicleSelector
              selected={transportMode}
              onChange={setTransportMode}
            />
            <LocationList
              locations={locations}
              onRemove={handleRemoveLocation}
              onReorder={handleReorderLocations}
              onUpdateName={handleUpdateLocationName}
            />
            {route && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-2">Route Details</h2>
                <div className="space-y-2 text-sm">
                  <p>Total Distance: {route.distance.toFixed(1)} km</p>
                  <p>Estimated Duration: {route.duration} mins</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;