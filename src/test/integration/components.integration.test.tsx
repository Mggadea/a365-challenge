import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../utils/testUtils';
import SearchBox from '../../components/searchBox';
import ReservationList from '../../components/reservationList';
import HomeScreen from '../../screens/homeScreen';
import { mockBookings, mockBookingsResponse, createFetchResponse } from '../utils/mocks';

describe('Components Integration Tests', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SearchBox', () => {
    it('should render with placeholder', () => {
      render(<SearchBox placeholder="Buscar..." />);
      
      expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    });

    it('should call onChange when typing', () => {
      const handleChange = vi.fn();
      render(<SearchBox onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(handleChange).toHaveBeenCalledWith('test');
    });

    it('should call onSearch when pressing Enter', () => {
      const handleSearch = vi.fn();
      render(<SearchBox onSearch={handleSearch} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Juan' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(handleSearch).toHaveBeenCalledWith('Juan');
    });

    it('should work as controlled component', () => {
      const handleChange = vi.fn();
      render(<SearchBox value="controlled" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('controlled');
    });
  });

  describe('ReservationList', () => {
    it('should show loading state', () => {
      render(<ReservationList data={[]} loading={true} error={null} />);
      
      expect(screen.getByText('Cargando reservas...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      render(<ReservationList data={[]} loading={false} error="Error de conexión" />);
      
      expect(screen.getByText('Error: Error de conexión')).toBeInTheDocument();
    });

    it('should show empty state', () => {
      render(<ReservationList data={[]} loading={false} error={null} />);
      
      expect(screen.getByText('No se encontraron reservas.')).toBeInTheDocument();
    });

    it('should render booking cards when data is available', () => {
      render(<ReservationList data={mockBookings} loading={false} error={null} />);
      
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
      expect(screen.getByText('Carlos López')).toBeInTheDocument();
    });
  });

  describe('HomeScreen Integration', () => {
    it('should show initial search prompt', () => {
      render(<HomeScreen />);
      
      expect(screen.getByText(/Ingresa un nombre de pasajero/)).toBeInTheDocument();
    });

    it('should search for bookings when user searches', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      render(<HomeScreen />);
      
      const input = screen.getByPlaceholderText('Buscar por pasajero o número de reserva...');
      fireEvent.change(input, { target: { value: 'Juan' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('pasajero=Juan')
        );
      });
    });

    it('should search by reserva when search term contains numbers', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      render(<HomeScreen />);
      
      const input = screen.getByPlaceholderText('Buscar por pasajero o número de reserva...');
      fireEvent.change(input, { target: { value: 'B001' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('reserva=B001')
        );
      });
    });

    it('should display bookings after successful search', async () => {
      mockFetch.mockResolvedValueOnce(createFetchResponse(mockBookingsResponse));

      render(<HomeScreen />);
      
      const input = screen.getByPlaceholderText('Buscar por pasajero o número de reserva...');
      fireEvent.change(input, { target: { value: 'Juan' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching', async () => {
      // Mock a delayed response
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve(createFetchResponse(mockBookingsResponse)), 100)
        )
      );

      render(<HomeScreen />);
      
      const input = screen.getByPlaceholderText('Buscar por pasajero o número de reserva...');
      fireEvent.change(input, { target: { value: 'Juan' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Cargando reservas...')).toBeInTheDocument();
      });
    });
  });
});
