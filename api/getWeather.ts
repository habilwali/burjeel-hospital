import type { WeatherApiResponse, Region, City, CityCoordinates } from '../types/weather';
import { cacheGet, cacheSet } from '../lib/cache';

// Use real API by default (Open-Meteo - free, no API key required)
const USE_REAL_API = true;

// City coordinates for weather API lookup
const CITY_COORDINATES: Record<string, CityCoordinates> = {
  // North Asia
  'BEIJING': { name: 'BEIJING', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai' },
  'SHANGHAI': { name: 'SHANGHAI', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai' },
  'TOKYO': { name: 'TOKYO', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  'SEOUL': { name: 'SEOUL', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul' },
  'HONG KONG': { name: 'HONG KONG', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong' },
  
  // South Asia
  'DUBAI': { name: 'DUBAI', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  'ABU DHABI': { name: 'ABU DHABI', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
  'DELHI': { name: 'DELHI', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  'MUMBAI': { name: 'MUMBAI', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  'BANGKOK': { name: 'BANGKOK', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
  
  // Middle East
  'RIYADH': { name: 'RIYADH', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
  'DOHA': { name: 'DOHA', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar' },
  'MUSCAT': { name: 'MUSCAT', latitude: 23.5859, longitude: 58.4059, timezone: 'Asia/Muscat' },
  'KUWAIT': { name: 'KUWAIT', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait' },
  'BAHRAIN': { name: 'BAHRAIN', latitude: 26.0667, longitude: 50.5577, timezone: 'Asia/Bahrain' },
};

/**
 * Get weather icon based on weather code from Open-Meteo
 */
function getWeatherIcon(weatherCode: number): string {
  // WMO Weather interpretation codes (WW)
  // 0: Clear sky, 1-3: Mainly clear/partly cloudy, 45-48: Foggy
  // 51-67: Drizzle/Rain, 71-77: Snow, 80-99: Rain showers/Thunderstorm
  if (weatherCode === 0) return '☀️'; // Clear sky
  if (weatherCode >= 1 && weatherCode <= 3) return '⛅'; // Partly cloudy
  if (weatherCode >= 45 && weatherCode <= 48) return '🌫️'; // Foggy
  if (weatherCode >= 51 && weatherCode <= 67) return '🌧️'; // Rain
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️'; // Snow
  if (weatherCode >= 80 && weatherCode <= 99) return '⛈️'; // Thunderstorm
  return '☁️'; // Default cloudy
}

/**
 * Format temperature range
 */
function formatTemperature(min: number, max: number): string {
  const minRounded = Math.round(min);
  const maxRounded = Math.round(max);
  return `${minRounded}°C to ${maxRounded}°C`;
}

/**
 * Format date and time for display
 */
function formatDateTime(date: Date, timezone: string): string {
  // Format: "16 Feb | 15:52"
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day} ${month} | ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

/**
 * Get mock weather data (fallback)
 */
function getMockWeatherData(): Region[] {
  const now = new Date();
  return [
    {
      name: 'North Asia',
      cities: [
        { name: 'BEIJING', time: formatDateTime(now, 'Asia/Shanghai'), weather: 'Cloudy', temperature: '-4°C to 8°C', icon: '☁️' },
        { name: 'SHANGHAI', time: formatDateTime(now, 'Asia/Shanghai'), weather: 'Sunny', temperature: '10°C to 18°C', icon: '☀️' },
        { name: 'TOKYO', time: formatDateTime(now, 'Asia/Tokyo'), weather: 'Sunny', temperature: '5°C to 13°C', icon: '☀️' },
        { name: 'SEOUL', time: formatDateTime(now, 'Asia/Seoul'), weather: 'Rainy', temperature: '-1°C to 2°C', icon: '🌧️' },
        { name: 'HONG KONG', time: formatDateTime(now, 'Asia/Hong_Kong'), weather: 'Sunny', temperature: '13°C to 21°C', icon: '☀️' },
      ],
    },
    {
      name: 'South Asia',
      cities: [
        { name: 'DUBAI', time: formatDateTime(now, 'Asia/Dubai'), weather: 'Sunny', temperature: '18°C to 28°C', icon: '☀️' },
        { name: 'ABU DHABI', time: formatDateTime(now, 'Asia/Dubai'), weather: 'Sunny', temperature: '17°C to 27°C', icon: '☀️' },
        { name: 'DELHI', time: formatDateTime(now, 'Asia/Kolkata'), weather: 'Cloudy', temperature: '12°C to 24°C', icon: '☁️' },
        { name: 'MUMBAI', time: formatDateTime(now, 'Asia/Kolkata'), weather: 'Sunny', temperature: '22°C to 31°C', icon: '☀️' },
        { name: 'BANGKOK', time: formatDateTime(now, 'Asia/Bangkok'), weather: 'Rainy', temperature: '24°C to 32°C', icon: '🌧️' },
      ],
    },
    {
      name: 'Middle East',
      cities: [
        { name: 'RIYADH', time: formatDateTime(now, 'Asia/Riyadh'), weather: 'Sunny', temperature: '15°C to 26°C', icon: '☀️' },
        { name: 'DOHA', time: formatDateTime(now, 'Asia/Qatar'), weather: 'Sunny', temperature: '16°C to 25°C', icon: '☀️' },
        { name: 'MUSCAT', time: formatDateTime(now, 'Asia/Muscat'), weather: 'Sunny', temperature: '19°C to 27°C', icon: '☀️' },
        { name: 'KUWAIT', time: formatDateTime(now, 'Asia/Kuwait'), weather: 'Cloudy', temperature: '11°C to 21°C', icon: '☁️' },
        { name: 'BAHRAIN', time: formatDateTime(now, 'Asia/Bahrain'), weather: 'Sunny', temperature: '17°C to 24°C', icon: '☀️' },
      ],
    },
  ];
}

/**
 * Fetch weather data for a single city from Open-Meteo API
 */
async function fetchCityWeather(cityKey: string): Promise<City | null> {
  const city = CITY_COORDINATES[cityKey];
  if (!city) {
    return null;
  }

  try {
    // Open-Meteo API - free, no API key required
    // Current weather + daily forecast
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=weather_code,temperature_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=${encodeURIComponent(city.timezone)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo API failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.current || !data.daily) {
      throw new Error('Invalid API response structure');
    }

    const currentTemp = data.current.temperature_2m || 20;
    const minTemp = data.daily.temperature_2m_min?.[0] || currentTemp - 5;
    const maxTemp = data.daily.temperature_2m_max?.[0] || currentTemp + 5;
    const weatherCode = data.current.weather_code || data.daily.weather_code?.[0] || 0;
    
    // Get current time in city's timezone
    const now = new Date();
    const timeStr = formatDateTime(now, city.timezone);
    
    // Determine weather description
    let weatherDesc = 'Sunny';
    if (weatherCode >= 1 && weatherCode <= 3) weatherDesc = 'Partly Cloudy';
    else if (weatherCode >= 45 && weatherCode <= 48) weatherDesc = 'Foggy';
    else if (weatherCode >= 51 && weatherCode <= 67) weatherDesc = 'Rainy';
    else if (weatherCode >= 71 && weatherCode <= 77) weatherDesc = 'Snowy';
    else if (weatherCode >= 80 && weatherCode <= 99) weatherDesc = 'Stormy';
    else if (weatherCode > 0) weatherDesc = 'Cloudy';

    return {
      name: cityKey,
      time: timeStr,
      weather: weatherDesc,
      temperature: formatTemperature(minTemp, maxTemp),
      icon: getWeatherIcon(weatherCode),
    };
  } catch {
    return null;
  }
}

/**
 * Fetches weather data from real API (Open-Meteo) or falls back to mock data
 */
export async function getWeather(): Promise<WeatherApiResponse> {
  const key = 'weather:all';
  
  // When using real API, bypass cache to always get fresh data
  // Only use cache for mock data
  if (!USE_REAL_API) {
    const cached = cacheGet<WeatherApiResponse>(key);
    if (cached) {
      return cached;
    }
  }

  // Try real API
  if (USE_REAL_API) {
    try {
      // Fetch weather for all cities in parallel
      const allCityKeys = Object.keys(CITY_COORDINATES);
      const cityPromises = allCityKeys.map(cityKey => fetchCityWeather(cityKey));
      const cityResults = await Promise.all(cityPromises);
      
      // Filter out null results
      const validCities = cityResults.filter((city): city is City => city !== null);
      
      if (validCities.length === 0) {
        throw new Error('No valid weather data received from API');
      }

      // Group cities by region
      const regions: Region[] = [
        {
          name: 'North Asia',
          cities: validCities.filter(c => ['BEIJING', 'SHANGHAI', 'TOKYO', 'SEOUL', 'HONG KONG'].includes(c.name)),
        },
        {
          name: 'South Asia',
          cities: validCities.filter(c => ['DUBAI', 'ABU DHABI', 'DELHI', 'MUMBAI', 'BANGKOK'].includes(c.name)),
        },
        {
          name: 'Middle East',
          cities: validCities.filter(c => ['RIYADH', 'DOHA', 'MUSCAT', 'KUWAIT', 'BAHRAIN'].includes(c.name)),
        },
      ];

      // Fill missing cities with mock data
      const mockData = getMockWeatherData();
      regions.forEach((region, regionIndex) => {
        const mockRegion = mockData[regionIndex];
        const existingCityNames = new Set(region.cities.map(c => c.name));
        mockRegion.cities.forEach(mockCity => {
          if (!existingCityNames.has(mockCity.name)) {
            region.cities.push(mockCity);
          }
        });
        // Sort cities to maintain order
        region.cities.sort((a, b) => {
          const order = mockRegion.cities.map(c => c.name);
          return order.indexOf(a.name) - order.indexOf(b.name);
        });
      });

      const data: WeatherApiResponse = {
        success: true,
        regions,
      };
      
      return data;
    } catch (error) {
      // swallow error and fall back to mock data
    }
  }

  // Fallback to mock data
  const mockData = getMockWeatherData();
  const data: WeatherApiResponse = {
    success: true,
    regions: mockData,
  };
  
  if (!USE_REAL_API) {
    cacheSet(key, data);
  }
  
  return data;
}
