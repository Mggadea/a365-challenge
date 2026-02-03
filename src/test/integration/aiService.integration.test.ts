import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateInsight, type InsightParams } from '../../API/aiService';
import { createFetchResponse } from '../utils/mocks';

describe('AIService Integration Tests', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const baseParams: InsightParams = {
    pasajero: 'Juan Pérez',
    destino: 'Madrid',
    fechaRegreso: '2026-02-15',
    estado: 'activa',
  };

  const mockGeminiResponse = {
    candidates: [
      {
        content: {
          parts: [
            {
              text: 'El pasajero tiene una reserva activa. Se recomienda verificar documentación.',
            },
          ],
        },
      },
    ],
  };

  describe('generateInsight', () => {
    it('should generate insight for a booking', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

      const result = await generateInsight(baseParams);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.insight).toBe('El pasajero tiene una reserva activa. Se recomienda verificar documentación.');
    });

    it('should include weather information in prompt when provided', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

      const paramsWithWeather: InsightParams = {
        ...baseParams,
        clima: {
          temp: 22,
          description: 'Soleado',
        },
      };

      await generateInsight(paramsWithWeather);

      const calledBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = calledBody.contents[0].parts[0].text;
      
      expect(promptText).toContain('22°C');
      expect(promptText).toContain('Soleado');
    });

    it('should handle missing weather information gracefully', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

      await generateInsight(baseParams);

      const calledBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const promptText = calledBody.contents[0].parts[0].text;
      
      expect(promptText).toContain('información no disponible');
    });

    it('should handle different booking states', async () => {
      const states: Array<'activa' | 'cancelada' | 'finalizada'> = ['activa', 'cancelada', 'finalizada'];

      for (const estado of states) {
        mockFetch.mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

        const params: InsightParams = { ...baseParams, estado };
        await generateInsight(params);

        const calledBody = JSON.parse(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][1].body);
        const promptText = calledBody.contents[0].parts[0].text;
        
        expect(promptText).toContain(estado);
      }
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse({}, false, 500));

      await expect(generateInsight(baseParams)).rejects.toThrow();
    });

    it('should handle rate limiting with retry', async () => {
      // First call returns 429, second succeeds
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 429 })
        .mockResolvedValueOnce(createFetchResponse(mockGeminiResponse));

      const result = await generateInsight(baseParams);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.insight).toBeDefined();
    }, 10000); // Increased timeout for retry delays

    it('should fail after max retries on persistent rate limiting', async () => {
      mockFetch
        .mockResolvedValue({ ok: false, status: 429 });

      await expect(generateInsight(baseParams)).rejects.toThrow('Rate Limit');
    }, 30000); // Increased timeout for multiple retries
  });
});
