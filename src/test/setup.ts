import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-gemini-api-key');
vi.stubEnv('VITE_WEATHER_AUTH_KEY', 'test-weather-auth-key');

// Mock fetch globally
global.fetch = vi.fn();
