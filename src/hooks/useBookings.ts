import { useQuery } from '@tanstack/react-query';
import { getBookings, type GetBookingsParams } from '../API/bookingService';

export const useBookings = (params?: GetBookingsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => getBookings(params),
    enabled,
  });
};
