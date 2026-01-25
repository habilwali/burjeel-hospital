/**
 * Flight data types for flight API
 */
export interface Flight {
  id: string;
  date: string;
  flightNumber: string;
  from: string;
  airline: string;
  terminal: string;
  status: 'On-Time' | 'Delayed' | 'Cancelled' | 'Boarding' | 'Departed';
}

export interface FlightApiResponse {
  success: boolean;
  flights: Flight[];
  type: 'arrival' | 'departure';
}
