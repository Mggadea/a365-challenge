import React from 'react';
import type { Booking } from '../types';
import ReservationCardWithWeather from './reservationCardWithWeather';

interface ReservationListProps {
  data: Booking[];
  loading: boolean;
  error: string | null;
}

const ReservationList: React.FC<ReservationListProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center p-5">
        <p>Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-5 text-gray-500">
        <p>No se encontraron reservas.</p>
      </div>
    );
  }

  return (
    <div>
      {data.map((booking) => (
        <ReservationCardWithWeather key={booking.reserva} booking={booking} />
      ))}
    </div>
  );
};

export default ReservationList;