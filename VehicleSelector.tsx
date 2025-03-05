import React from 'react';
import { TransportMode } from '../types';
import { vehicleOptions } from '../services/routeOptimizer';

interface VehicleSelectorProps {
  selected: TransportMode;
  onChange: (mode: TransportMode) => void;
}

export function VehicleSelector({ selected, onChange }: VehicleSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Transport Mode</h2>
      <div className="grid grid-cols-2 gap-2">
        {vehicleOptions.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => onChange(vehicle.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selected === vehicle.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{vehicle.icon}</span>
            <span>{vehicle.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}