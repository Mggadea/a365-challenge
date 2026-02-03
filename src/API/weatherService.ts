const API_URL = 'http://api.assist-365.com/api/weather/current';
const AUTH_KEY = import.meta.env.VITE_WEATHER_AUTH_KEY;

export interface WeatherParams {
  city: string;
  units?: 'metric' | 'imperial';
  lang?: string;
}

export interface WeatherResponse {
  temp: number;
  description: string;
  city: string;
}

export const getWeather = async (params: WeatherParams): Promise<WeatherResponse> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('city', params.city);
  
  if (params.units) {
    queryParams.append('units', params.units);
  } else {
    queryParams.append('units', 'metric');
  }
  
  if (params.lang) {
    queryParams.append('lang', params.lang);
  } else {
    queryParams.append('lang', 'es');
  }

  const url = `${API_URL}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      'X-System-Auth-Key': AUTH_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching weather: ${response.statusText}`);
  }

  const data = await response.json();
  
  const weatherData: WeatherResponse = {
    temp: data.data.temperature,
    description: data.data.weather?.description || data.data.weather?.main || '',
    city: data.data.city,
  };
  
  return weatherData;
};
