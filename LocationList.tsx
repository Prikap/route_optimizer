import { GripVertical, Trash2 } from 'lucide-react';
import { Location } from '../types';

interface LocationListProps {
  locations: Location[];
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onUpdateName: (id: string, name: string) => void;
}

export function LocationList({ locations, onRemove, onReorder, onUpdateName }: LocationListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Delivery Locations</h2>
      <div className="space-y-2">
        {locations.map((location, index) => (
          <div
            key={location.id}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded group"
          >
            <div className="cursor-move text-gray-400">
              <GripVertical size={18} />
            </div>
            <input
              type="text"
              value={location.name}
              onChange={(e) => onUpdateName(location.id, e.target.value)}
              className="flex-1 bg-transparent border-0 focus:ring-1 focus:ring-blue-500 rounded px-2"
            />
            <button
              onClick={() => onRemove(location.id)}
              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Drag to reorder stops • Click location names to edit
      </p>
    </div>
  );
}