/**
 * Example: Updated getFlights function to use database API
 * 
 * Replace your existing getFlights function with this version
 * that calls your database API instead of OpenSky directly.
 */

import type { FlightApiResponse, Flight } from '../types/flight';
import { cacheGet, cacheSet } from '../lib/cache';
import { IPTV_API_BASE } from './config';

/**
 * Fetches flight data from your database API
 * @param airportIcao - Airport ICAO code (optional, e.g., 'OMDB' for Dubai). If not provided, returns flights for all active airports.
 * @param type - 'arrival' or 'departure'
 */
export async function getFlights(
  airportIcao?: string, // Optional airport ICAO code
  type: 'arrival' | 'departure' = 'arrival'
): Promise<FlightApiResponse> {
  const key = `flights:${airportIcao || 'all'}:${type}`;
  
  // Check cache first (cache for 5 minutes)
  const cached = cacheGet<FlightApiResponse>(key);
  if (cached) {
    return cached;
  }

  try {
    // Build API URL - only include airport parameter if provided
    let apiUrl = `${IPTV_API_BASE}/get_flights_from_db.php?type=${type}&limit=15`;
    if (airportIcao) {
      apiUrl += `&airport=${airportIcao}`;
    }
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Database API failed: ${res.status} ${res.statusText}`);
    }
    
    const apiData = await res.json();
    
    if (apiData.success && apiData.flights && Array.isArray(apiData.flights)) {
      // Transform to match Flight interface if needed
      const flights: Flight[] = apiData.flights.map((flight: any) => ({
        id: String(flight.id || Math.random()),
        date: flight.date || '',
        flightNumber: flight.flightNumber || flight.flight_number || '',
        from: flight.from || 'Unknown',
        airline: flight.airline || 'Airlines',
        terminal: String(flight.terminal || '1'),
        status: flight.status || 'On-Time',
      }));
      
      if (flights.length > 0) {
        const data: FlightApiResponse = {
          success: true,
          flights,
          type,
        };
        // Cache for 5 minutes
        cacheSet(key, data);
        return data;
      } else {
        throw new Error('No flights returned from API');
      }
    } else {
      throw new Error('Invalid API response format');
    }
  } catch {
    // Fall back to mock data
    const mockFlights: Flight[] = getMockFlights(type);
    const data: FlightApiResponse = {
      success: false,
      flights: mockFlights,
      type,
    };
    cacheSet(key, data);
    return data;
  }
}

/**
 * Mock flight data matching your design (fallback)
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
    ];
  }
}
