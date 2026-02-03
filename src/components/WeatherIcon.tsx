import React from 'react';

interface WeatherIconProps {
  description: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ description, size = 40 }) => {
  const normalizedDescription = description.toLowerCase();

  // Determinar qué icono mostrar basado en la descripción del clima
  const getWeatherIcon = () => {
    // Soleado / Despejado
    if (
      normalizedDescription.includes('sol') ||
      normalizedDescription.includes('despejado') ||
      normalizedDescription.includes('clear') ||
      normalizedDescription.includes('sunny')
    ) {
      return <SunIcon size={size} />;
    }

    // Parcialmente nublado
    if (
      normalizedDescription.includes('parcialmente nublado') ||
      normalizedDescription.includes('partly cloudy') ||
      normalizedDescription.includes('nubes dispersas') ||
      normalizedDescription.includes('scattered clouds') ||
      normalizedDescription.includes('pocas nubes') ||
      normalizedDescription.includes('few clouds')
    ) {
      return <PartlyCloudyIcon size={size} />;
    }

    // Nublado
    if (
      normalizedDescription.includes('nublado') ||
      normalizedDescription.includes('nubes') ||
      normalizedDescription.includes('cloudy') ||
      normalizedDescription.includes('clouds') ||
      normalizedDescription.includes('overcast')
    ) {
      return <CloudyIcon size={size} />;
    }

    // Lluvia
    if (
      normalizedDescription.includes('lluvia') ||
      normalizedDescription.includes('rain') ||
      normalizedDescription.includes('llovizna') ||
      normalizedDescription.includes('drizzle') ||
      normalizedDescription.includes('shower')
    ) {
      return <RainIcon size={size} />;
    }

    // Tormenta
    if (
      normalizedDescription.includes('tormenta') ||
      normalizedDescription.includes('storm') ||
      normalizedDescription.includes('thunder') ||
      normalizedDescription.includes('trueno') ||
      normalizedDescription.includes('relámpago')
    ) {
      return <ThunderstormIcon size={size} />;
    }

    // Nieve
    if (
      normalizedDescription.includes('nieve') ||
      normalizedDescription.includes('snow') ||
      normalizedDescription.includes('nevada') ||
      normalizedDescription.includes('nevando')
    ) {
      return <SnowIcon size={size} />;
    }

    // Niebla / Bruma
    if (
      normalizedDescription.includes('niebla') ||
      normalizedDescription.includes('fog') ||
      normalizedDescription.includes('mist') ||
      normalizedDescription.includes('bruma') ||
      normalizedDescription.includes('haze') ||
      normalizedDescription.includes('neblina')
    ) {
      return <FogIcon size={size} />;
    }

    // Viento
    if (
      normalizedDescription.includes('viento') ||
      normalizedDescription.includes('wind') ||
      normalizedDescription.includes('ventoso')
    ) {
      return <WindIcon size={size} />;
    }

    // Default: sol con nubes
    return <PartlyCloudyIcon size={size} />;
  };

  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      {getWeatherIcon()}
    </div>
  );
};

// Iconos SVG flat

const SunIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="14" fill="#FFD93D" />
    <g stroke="#FFD93D" strokeWidth="3" strokeLinecap="round">
      <line x1="32" y1="6" x2="32" y2="12" />
      <line x1="32" y1="52" x2="32" y2="58" />
      <line x1="6" y1="32" x2="12" y2="32" />
      <line x1="52" y1="32" x2="58" y2="32" />
      <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
      <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
      <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
      <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
    </g>
  </svg>
);

const CloudyIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 42H16a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42 20a12 12 0 0 1 6 22Z"
      fill="#B0BEC5"
    />
  </svg>
);

const PartlyCloudyIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="10" fill="#FFD93D" />
    <g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round">
      <line x1="22" y1="4" x2="22" y2="8" />
      <line x1="22" y1="36" x2="22" y2="40" />
      <line x1="4" y1="22" x2="8" y2="22" />
      <line x1="36" y1="22" x2="40" y2="22" />
      <line x1="9.3" y1="9.3" x2="12.1" y2="12.1" />
      <line x1="31.9" y1="31.9" x2="34.7" y2="34.7" />
      <line x1="9.3" y1="34.7" x2="12.1" y2="31.9" />
      <line x1="31.9" y1="12.1" x2="34.7" y2="9.3" />
    </g>
    <path
      d="M52 48H24a8 8 0 0 1-1.2-15.9A11 11 0 0 1 46 30a9.5 9.5 0 0 1 6 18Z"
      fill="#B0BEC5"
    />
  </svg>
);

const RainIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 34H16a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42 12a12 12 0 0 1 6 22Z"
      fill="#78909C"
    />
    <g stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round">
      <line x1="20" y1="42" x2="16" y2="52" />
      <line x1="32" y1="42" x2="28" y2="52" />
      <line x1="44" y1="42" x2="40" y2="52" />
      <line x1="26" y1="50" x2="22" y2="60" />
      <line x1="38" y1="50" x2="34" y2="60" />
    </g>
  </svg>
);

const ThunderstormIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 32H16a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42 10a12 12 0 0 1 6 22Z"
      fill="#546E7A"
    />
    <polygon points="34,36 28,46 33,46 29,58 40,44 34,44 38,36" fill="#FFD93D" />
    <g stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="40" x2="14" y2="50" />
      <line x1="48" y1="40" x2="44" y2="50" />
    </g>
  </svg>
);

const SnowIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 34H16a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42 12a12 12 0 0 1 6 22Z"
      fill="#90A4AE"
    />
    <g fill="#E3F2FD">
      <circle cx="20" cy="44" r="3" />
      <circle cx="32" cy="48" r="3" />
      <circle cx="44" cy="44" r="3" />
      <circle cx="26" cy="56" r="2.5" />
      <circle cx="38" cy="56" r="2.5" />
    </g>
  </svg>
);

const FogIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 28H16a10 10 0 0 1-1.5-19.9A14 14 0 0 1 42 6a12 12 0 0 1 6 22Z"
      fill="#B0BEC5"
    />
    <g stroke="#CFD8DC" strokeWidth="3" strokeLinecap="round">
      <line x1="10" y1="38" x2="54" y2="38" />
      <line x1="14" y1="46" x2="50" y2="46" />
      <line x1="18" y1="54" x2="46" y2="54" />
    </g>
  </svg>
);

const WindIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#78909C" strokeWidth="3" strokeLinecap="round">
      <path d="M8 24h30a6 6 0 1 0-6-6" fill="none" />
      <path d="M8 36h38a6 6 0 1 1-6 6" fill="none" />
      <path d="M16 48h20a4 4 0 1 0-4-4" fill="none" />
    </g>
  </svg>
);

export default WeatherIcon;
