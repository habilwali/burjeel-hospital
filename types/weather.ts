export interface City {
  name: string;
  time: string;
  weather: string;
  temperature: string;
  icon: string;
}

export interface Region {
  name: string;
  cities: City[];
}

export interface WeatherApiResponse {
  success: boolean;
  regions: Region[];
  error?: string;
}

// City coordinates for API lookup
export interface CityCoordinates {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
