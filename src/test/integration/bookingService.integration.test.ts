import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBookings } from '../../API/bookingService';
import { mockBookingsResponse, mockEmptyBookingsResponse, createFetchResponse } from '../utils/mocks';

describe('BookingService Integration Tests', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBookings', () => {
    it('should fetch bookings without parameters', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const result = await getBookings();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://3ccfrjulc8.execute-api.us-west-1.amazonaws.com/dev/reservasHandler'
      );
      expect(result).toEqual(mockBookingsResponse);
    });

    it('should fetch bookings with pasajero filter', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const result = await getBookings({ pasajero: 'Juan' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pasajero=Juan')
      );
      expect(result).toEqual(mockBookingsResponse);
    });

    it('should fetch bookings with reserva filter', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const result = await getBookings({ reserva: 'B001' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('reserva=B001')
      );
      expect(result).toEqual(mockBookingsResponse);
    });

    it('should fetch bookings with pagination', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const result = await getBookings({ page: 2, pageSize: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/page=2.*pageSize=10|pageSize=10.*page=2/)
      );
      expect(result).toEqual(mockBookingsResponse);
    });

    it('should handle empty results', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockEmptyBookingsResponse));

      const result = await getBookings({ pasajero: 'NonExistent' });

      expect(result.resultados).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 500));

      await expect(getBookings()).rejects.toThrow('Error fetching bookings');
    });

    it('should combine multiple query parameters', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      await getBookings({ pasajero: 'Juan', page: 1, pageSize: 5 });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('pasajero=Juan');
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).toContain('pageSize=5');
    });
  });
});
