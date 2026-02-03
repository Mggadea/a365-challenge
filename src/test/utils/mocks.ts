import type { Booking, BookingsResponse } from '../../types';
import type { WeatherResponse } from '../../API/weatherService';
import type { InsightResponse } from '../../API/aiService';

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    reserva: 'B001',
    pasajero: 'Juan Pérez',
    destino: 'Madrid',
    estado: 'activa',
    fecha_regreso: '2026-02-15',
  },
  {
    reserva: 'B002',
    pasajero: 'María García',
    destino: 'París',
    estado: 'finalizada',
    fecha_regreso: '2026-01-20',
  },
  {
    reserva: 'B003',
    pasajero: 'Carlos López',
    destino: 'Londres',
    estado: 'cancelada',
    fecha_regreso: '2026-03-10',
  },
];

export const mockBookingsResponse: BookingsResponse = {
  total: 3,
  page: 1,
  pageSize: 5,
  resultados: mockBookings,
};

export const mockEmptyBookingsResponse: BookingsResponse = {
  total: 0,
  page: 1,
  pageSize: 5,
  resultados: [],
};

// Mock Weather
export const mockWeatherResponse: WeatherResponse = {
  temp: 22,
  description: 'Cielo despejado',
  city: 'Madrid',
};

export const mockWeatherApiResponse = {
  data: {
    temperature: 22,
    weather: {
      description: 'Cielo despejado',
      main: 'Clear',
    },
    city: 'Madrid',
  },
};

// Mock AI Insight
export const mockInsightResponse: InsightResponse = {
  insight: 'El pasajero tiene una reserva activa con buen clima en el destino. Recomendado para actividades al aire libre.',
};

// Helper to create mock fetch responses
export const createFetchResponse = <T>(data: T, ok = true, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Error',
  json: async () => data,
});

// Helper for fetch mock setup
export const mockFetchSuccess = <T>(data: T) => {
  return Promise.resolve(createFetchResponse(data));
};

export const mockFetchError = (statusText = 'Internal Server Error', status = 500) => {
  return Promise.resolve(createFetchResponse({}, false, status));
};
