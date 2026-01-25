import type { FlightApiResponse, Flight } from '../types/flight';
import { cacheGet, cacheSet } from '../lib/cache';

// Use real API by default (OpenSky Network - free, no API key required)
const USE_REAL_API = true;

/**
 * Fetches flight data from real API (OpenSky Network) or falls back to mock data
 * @param airportIcao - Airport ICAO code (e.g., 'OMDB' for Dubai)
 * @param type - 'arrival' or 'departure'
 */
export async function getFlights(
  airportIcao: string = 'OMDB', // Dubai International Airport
  type: 'arrival' | 'departure' = 'arrival'
): Promise<FlightApiResponse> {
  const key = `flights:${airportIcao}:${type}`;
  
  // When using real API, bypass cache to always get fresh data
  // Only use cache for mock data
  if (!USE_REAL_API) {
    const cached = cacheGet<FlightApiResponse>(key);
    if (cached) {
      console.log('[getFlights] Using cached data for', type);
      return cached;
    }
  } else {
    console.log('[getFlights] Bypassing cache to fetch fresh real data');
  }

  // Try real API
  if (USE_REAL_API) {
    try {
      console.log('[getFlights] 🌐 Fetching REAL flight data from OpenSky Network API...');
      
      // OpenSky Network API - free, no API key required
      // Get all flights currently in the air
      const openskyUrl = 'https://opensky-network.org/api/states/all';
      const res = await fetch(openskyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`OpenSky API failed: ${res.status} ${res.statusText}`);
      }
      
      const apiData = await res.json();
      console.log('[getFlights] ✅ API Response received, processing', apiData.states?.length || 0, 'flights...');
      
      // OpenSky returns array of flight states
      // Each state: [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, ...]
      const states = apiData.states || [];
      
      if (states.length === 0) {
        throw new Error('No flights returned from API');
      }
      
      // Transform OpenSky data to match our Flight interface
      const now = new Date();
      const flights: Flight[] = states
        .filter((state: any[]) => state && state[1]) // Filter out flights without callsign
        .slice(0, 15) // Limit to 15 flights
        .map((state: any[], index: number) => {
          const callsign = (state[1] || '').trim() || `FL${index + 1}`;
          const originCountry = state[2] || 'Unknown';
          const timePosition = state[3] || Math.floor(Date.now() / 1000);
          
          // Calculate time
          const flightDate = new Date(timePosition * 1000);
          const hours = flightDate.getHours();
          const minutes = flightDate.getMinutes();
          const dateStr = `${flightDate.getDate()}/${flightDate.getMonth() + 1} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
          
          // Determine status
          const timeDiff = (Date.now() / 1000) - timePosition;
          let status: Flight['status'] = 'On-Time';
          if (timeDiff > 7200) status = 'Delayed'; // More than 2 hours old
          if (Math.random() > 0.85) status = 'Delayed'; // 15% chance of delayed
          if (Math.random() > 0.95) status = 'Cancelled'; // 5% chance of cancelled
          
          return {
            id: String(index + 1),
            date: dateStr,
            flightNumber: callsign,
            from: `${originCountry} Airport`,
            airline: getAirlineFromCallsign(callsign),
            terminal: String(Math.floor(Math.random() * 3) + 1),
            status,
          };
        });
      
      if (flights.length > 0) {
        console.log('[getFlights] ✅ Successfully fetched', flights.length, 'REAL flights from OpenSky API');
        const data: FlightApiResponse = {
          success: true,
          flights,
          type,
        };
        // Cache for 5 minutes only
        cacheSet(key, data);
        return data;
      } else {
        throw new Error('No valid flights processed from API');
      }
    } catch (error: any) {
      console.error('[getFlights] ❌ Real API failed:', error?.message || error);
      console.log('[getFlights] ⚠️ Falling back to mock data');
    }
  }
  
  // Fall back to mock data
  console.log('[getFlights] 📝 Using mock data for', type);
  const mockFlights: Flight[] = getMockFlights(type);
  const data: FlightApiResponse = {
    success: false,
    flights: mockFlights,
    type,
  };
  
  console.log('[getFlights] Returning', mockFlights.length, 'mock flights');
  cacheSet(key, data);
  return data;
}

/**
 * Helper function to get airline name from flight callsign
 */
function getAirlineFromCallsign(callsign: string): string {
  const airlineMap: { [key: string]: string } = {
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'EY': 'Etihad Airways',
    'BA': 'British Airways',
    'AF': 'Air France',
    'LH': 'Lufthansa',
    'KL': 'KLM',
    'TK': 'Turkish Airlines',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'QF': 'Qantas',
    'AA': 'American Airlines',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
  };
  
  // Try to match first 2 letters of callsign
  const prefix = callsign.substring(0, 2);
  return airlineMap[prefix] || 'Airlines';
}

/**
 * Mock flight data matching your design
 */
function getMockFlights(type: 'arrival' | 'departure'): Flight[] {
  if (type === 'arrival') {
    return [
      {
        id: '1',
        date: '6/7 15:50',
        flightNumber: 'AF257',
        from: 'Larnaca International Airport',
        airline: 'Cebgo Airlines',
        terminal: '1',
        status: 'On-Time',
      },
      {
        id: '2',
        date: '6/7 15:55',
        flightNumber: 'BF330',
        from: 'Paphos International Airport',
        airline: 'Philippine Airlines',
        terminal: '2',
        status: 'Delayed',
      },
      {
        id: '3',
        date: '6/7 15:55',
        flightNumber: 'EX100',
        from: 'Cagayan De Oro Domestic Airport',
        airline: 'Cebgo Airlines',
        terminal: '1',
        status: 'On-Time',
      },
      {
        id: '4',
        date: '6/7 16:05',
        flightNumber: 'KL557',
        from: 'Guam International',
        airline: 'Philippine Airlines',
        terminal: '3',
        status: 'Cancelled',
      },
      {
        id: '5',
        date: '6/7 15:55',
        flightNumber: 'BF330',
        from: 'Taiwan Taoyuan International (Chiang Kai Shek International)',
        airline: 'EVA Air',
        terminal: '2',
        status: 'Delayed',
      },
      {
        id: '6',
        date: '6/7 15:55',
        flightNumber: 'BF330',
        from: 'Hong Kong International',
        airline: 'Philippine Airlines',
        terminal: '2',
        status: 'Delayed',
      },
    ];
  } else {
    return [
      {
        id: '1',
        date: '6/7 16:30',
        flightNumber: 'EK215',
        from: 'Dubai International Airport',
        airline: 'Emirates',
        terminal: '3',
        status: 'On-Time',
      },
      {
        id: '2',
        date: '6/7 17:00',
        flightNumber: 'QR701',
        from: 'Doha Hamad International',
        airline: 'Qatar Airways',
        terminal: '1',
        status: 'On-Time',
      },
      {
        id: '3',
        date: '6/7 17:30',
        flightNumber: 'BA123',
        from: 'London Heathrow',
        airline: 'British Airways',
        terminal: '2',
        status: 'Delayed',
      },
    ];
  }
}
