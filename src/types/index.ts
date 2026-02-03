export interface Booking {
  reserva: string;
  pasajero: string;
  destino: string;
  estado: 'activa' | 'cancelada' | 'finalizada';
  fecha_regreso: string;
}

export interface BookingsResponse {
  total: number;
  page: number;
  pageSize: number;
  resultados: Booking[];
}

export interface Weather {
  temp: number;
  description: string;
  city: string;
}

export interface BookingWithContext extends Booking {
  weather?: Weather;
  aiInsight?: string;
}
