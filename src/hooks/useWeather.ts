import { useQuery } from '@tanstack/react-query';
import { getWeather, type WeatherParams } from '../API/weatherService';

export const useWeather = (params: WeatherParams | null) => {
  return useQuery({
    queryKey: ['weather', params?.city],
    queryFn: () => getWeather(params!),
    enabled: !!params?.city,
    staleTime: 1000 * 60 * 10,
  });
};
