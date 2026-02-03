import React, { useState } from 'react';
import type { Booking } from '../types';
import ReservationCard from './reservationCard';
import { useWeather } from '../hooks/useWeather';
import { useAIInsight } from '../hooks/useAIInsight';

interface ReservationCardWithWeatherProps {
  booking: Booking;
}

const ReservationCardWithWeather: React.FC<ReservationCardWithWeatherProps> = ({ booking }) => {
  const [showInsight, setShowInsight] = useState(false);
  const [insight, setInsight] = useState<string | undefined>(undefined);
  const shouldFetchWeather = booking.estado === 'activa';
  
  const { data: weather, isLoading: weatherLoading } = useWeather(
    shouldFetchWeather ? { city: booking.destino } : null
  );

  const { mutate: generateInsight, isPending: insightLoading } = useAIInsight();

  const handleCardClick = () => {
    if (showInsight) {
      setShowInsight(false);
      return;
    }
    
    setShowInsight(true);
    
    if (!insight) {
      generateInsight(
        {
          pasajero: booking.pasajero,
          destino: booking.destino,
          fechaRegreso: booking.fecha_regreso,
          estado: booking.estado,
          clima: weather ? { temp: weather.temp, description: weather.description } : undefined,
        },
        {
          onSuccess: (data) => {
            setInsight(data.insight);
          },
          onError: (error) => {
            setInsight(`Error al generar insight: ${error.message}`);
          },
        }
      );
    }
  };

  return (
    <ReservationCard 
      booking={booking} 
      weather={weather}
      weatherLoading={weatherLoading && shouldFetchWeather}
      onClick={handleCardClick}
      insight={insight}
      insightLoading={insightLoading}
      showInsight={showInsight}
    />
  );
};

export default ReservationCardWithWeather;
