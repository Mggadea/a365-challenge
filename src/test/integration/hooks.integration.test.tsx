import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useWeather } from '../../hooks/useWeather';
import { useAIInsight } from '../../hooks/useAIInsight';
import { 
  mockBookingsResponse, 
  mockWeatherApiResponse, 
  createFetchResponse 
} from '../utils/mocks';

describe('Hooks Integration Tests', () => {
  const mockFetch = vi.fn();
  let queryClient: QueryClient;

  const createWrapper = () => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  describe('useBookings', () => {
    it('should fetch bookings when enabled', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const { result } = renderHook(
        () => useBookings({ pasajero: 'Juan' }, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockBookingsResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pasajero=Juan')
      );
    });

    it('should not fetch when disabled', async () => {
      const { result } = renderHook(
        () => useBookings({ pasajero: 'Juan' }, false),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 500));

      const { result } = renderHook(
        () => useBookings({ pasajero: 'Juan' }, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should refetch when params change', async () => {
      mockFetch
        .mockResolvedValueOnce(createFetchResponse(mockBookingsResponse))
        .mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      const { result, rerender } = renderHook(
        ({ params }) => useBookings(params, true),
        { 
          wrapper: createWrapper(),
          initialProps: { params: { pasajero: 'Juan' } }
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      rerender({ params: { pasajero: 'María' } });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useWeather', () => {
    it('should fetch weather when city is provided', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      const { result } = renderHook(
        () => useWeather({ city: 'Madrid' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.city).toBe('Madrid');
      expect(result.current.data?.temp).toBe(22);
    });

    it('should not fetch when params is null', async () => {
      const { result } = renderHook(
        () => useWeather(null),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not fetch when city is empty', async () => {
      const { result } = renderHook(
        () => useWeather({ city: '' }),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should use stale time for caching', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      const { result, rerender } = renderHook(
        () => useWeather({ city: 'Madrid' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Rerender with same params
      rerender();

      // Should not fetch again due to stale time
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('useAIInsight', () => {
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Test insight response' }],
          },
        },
      ],
    };

    it('should generate insight on mutate', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

      const { result } = renderHook(
        () => useAIInsight(),
        { wrapper: createWrapper() }
      );

      result.current.mutate({
        pasajero: 'Juan',
        destino: 'Madrid',
        fechaRegreso: '2026-02-15',
        estado: 'activa',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.insight).toBe('Test insight response');
    });

    it('should handle mutation errors', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 500));

      const { result } = renderHook(
        () => useAIInsight(),
        { wrapper: createWrapper() }
      );

      result.current.mutate({
        pasajero: 'Juan',
        destino: 'Madrid',
        fechaRegreso: '2026-02-15',
        estado: 'activa',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should be idle before mutation', () => {
      const { result } = renderHook(
        () => useAIInsight(),
        { wrapper: createWrapper() }
      );

      expect(result.current.isIdle).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
