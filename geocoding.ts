export interface SearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export async function searchLocations(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
    {
      headers: {
        'Accept-Language': 'en'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  const data = await response.json();
  
  return data.map((item: any) => ({
    id: item.place_id.toString(),
    name: item.display_name.split(',')[0],
    address: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon)
  }));
}