import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWeather } from '../../API/weatherService';
import { mockWeatherApiResponse, createFetchResponse } from '../utils/mocks';

describe('WeatherService Integration Tests', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getWeather', () => {
    it('should fetch weather for a city', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      const result = await getWeather({ city: 'Madrid' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('city=Madrid'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-System-Auth-Key': expect.any(String),
          }),
        })
      );
      expect(result.city).toBe('Madrid');
      expect(result.temp).toBe(22);
      expect(result.description).toBe('Cielo despejado');
    });

    it('should use metric units by default', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      await getWeather({ city: 'Madrid' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('units=metric'),
        expect.any(Object)
      );
    });

    it('should use spanish language by default', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      await getWeather({ city: 'Madrid' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lang=es'),
        expect.any(Object)
      );
    });

    it('should respect custom units parameter', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      await getWeather({ city: 'New York', units: 'imperial' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('units=imperial'),
        expect.any(Object)
      );
    });

    it('should respect custom lang parameter', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockWeatherApiResponse));

      await getWeather({ city: 'Paris', lang: 'fr' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lang=fr'),
        expect.any(Object)
      );
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 404));

      await expect(getWeather({ city: 'InvalidCity' })).rejects.toThrow('Error fetching weather');
    });

    it('should handle weather response with main fallback', async () => {
      const responseWithMainOnly = {
        data: {
          temperature: 15,
          weather: {
            main: 'Cloudy',
          },
          city: 'Londres',
        },
      };
      mockFetch.mockResolvedValueOnce(createFetchResponse(responseWithMainOnly));

      const result = await getWeather({ city: 'Londres' });

      expect(result.description).toBe('Cloudy');
    });
  });
});
