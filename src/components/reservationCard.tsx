import React from 'react';
import type { Booking, Weather } from '../types';
import { formatDateToSpanish } from '../utils/dateFormatter';
import WeatherIcon from './WeatherIcon';

interface ReservationCardProps {
  booking: Booking;
  weather?: Weather;
  weatherLoading?: boolean;
  onClick?: () => void;
  insight?: string;
  insightLoading?: boolean;
  showInsight?: boolean;
}

const statusClasses: Record<Booking['estado'], string> = {
  activa: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  finalizada: 'bg-gray-200 text-gray-600',
};

const ReservationCard: React.FC<ReservationCardProps> = ({ 
  booking, 
  weather, 
  weatherLoading, 
  onClick,
  insight,
  insightLoading,
  showInsight 
}) => {
  const statusClass = statusClasses[booking.estado];

  return (
    <div className="mb-3">
      <div
        onClick={onClick}
        className={`flex justify-between border border-gray-300 rounded-xl p-4 bg-white shadow-sm transition-shadow duration-200 ${
          onClick ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
        } ${showInsight ? 'rounded-b-none border-b-0' : ''}`}
      >
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="m-0 text-xl font-semibold text-gray-900">
                {booking.pasajero}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Reserva: {booking.reserva}
              </p>
            </div>

            <span className={`py-1 px-3 rounded-full text-xs font-medium capitalize ${statusClass}`}>
              {booking.estado}
            </span>
          </div>

          <div className="flex gap-6">
            <div>
              <p className="m-0 text-xs text-gray-400 uppercase tracking-wide">
                Destino
              </p>
              <p className="mt-1 text-base font-medium text-gray-700">
                {booking.destino}
              </p>
            </div>

            <div>
              <p className="m-0 text-xs text-gray-400 uppercase tracking-wide">
                Fecha de Regreso
              </p>
              <p className="mt-1 text-base font-medium text-gray-700">
                {formatDateToSpanish(booking.fecha_regreso)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-w-30 ml-6 pl-6 border-l border-gray-100">
          {weatherLoading ? (
            <>
              <p className="m-0 text-xs text-gray-400 uppercase tracking-wide">
                Clima
              </p>
              <p className="mt-1 text-sm text-gray-300">
                Cargando...
              </p>
            </>
          ) : weather ? (
            <>
              <p className="m-0 text-xs text-gray-400 uppercase tracking-wide">
                Clima
              </p>
              <WeatherIcon description={weather.description} size={36} />
              <p className="mt-1 text-2xl font-semibold text-gray-700">
                {weather.temp.toFixed(0)}°C
              </p>
              <p className="mt-1 text-sm text-gray-500 capitalize">
                {weather.description}
              </p>
            </>
          ) : (
            <>
              <p className="m-0 text-xs text-gray-400 uppercase tracking-wide">
                Clima
              </p>
              <p className="mt-1 text-sm text-gray-300">
                No disponible
              </p>
            </>
          )}
        </div>
      </div>

      {showInsight && (
        <div className="bg-blue-50 border border-t-0 border-gray-300 rounded-b-xl p-4 shadow-sm">
          <p className="m-0 text-xs text-blue-600 uppercase tracking-wide font-medium mb-2">
            💡 Insight IA
          </p>
          {insightLoading ? (
            <p className="m-0 text-sm text-blue-800 italic">Generando insight...</p>
          ) : insight ? (
            <p className="m-0 text-sm text-blue-900">{insight}</p>
          ) : (
            <p className="m-0 text-sm text-blue-400">Haz clic para generar un insight</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
