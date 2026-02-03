import type { BookingsResponse } from '../types';

const API_URL = 'https://3ccfrjulc8.execute-api.us-west-1.amazonaws.com/dev/reservasHandler';

export interface GetBookingsParams {
  pasajero?: string;
  reserva?: string;
  page?: number;
  pageSize?: number;
}

export const getBookings = async (params?: GetBookingsParams): Promise<BookingsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.pasajero) {
    queryParams.append('pasajero', params.pasajero);
  }
  if (params?.reserva) {
    queryParams.append('reserva', params.reserva);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const url = queryParams.toString() 
    ? `${API_URL}?${queryParams.toString()}` 
    : API_URL;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching bookings: ${response.statusText}`);
  }

  const data: BookingsResponse = await response.json();
  return data;
};
