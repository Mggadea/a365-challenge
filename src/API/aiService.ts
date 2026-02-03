const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface InsightParams {
  pasajero: string;
  destino: string;
  fechaRegreso: string;
  estado: 'activa' | 'cancelada' | 'finalizada';
  clima?: {
    temp: number;
    description: string;
  };
}

export interface InsightResponse {
  insight: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      // Exponential backoff with jitter: 2s, 4s, 8s + random jitter
      const waitTime = Math.pow(2, i + 1) * 1000 + Math.random() * 1000;
      await delay(waitTime);
      continue;
    }
    
    return response;
  }
  
  throw new Error('El servicio está ocupado (Rate Limit). Por favor espera un momento e intenta nuevamente.');
};

export const generateInsight = async (params: InsightParams): Promise<InsightResponse> => {
  const climaInfo = params.clima 
    ? `${params.clima.temp.toFixed(0)}°C, ${params.clima.description}` 
    : 'información no disponible';

  const prompt = `Eres un asistente inteligente para agentes de asistencia  de viaje. Genera un breve mensaje de asistencia (máximo 2 o 3  oraciones) para ayudar al agente con esta reserva:

- Pasajero: ${params.pasajero}
- Destino: ${params.destino}
- Fecha de regreso: ${params.fechaRegreso}
- Estado de la reserva: ${params.estado}
- Clima actual en destino: ${climaInfo}

El mensaje debe ser útil, profesional y sugerir una acción que el agente podría tomar o recomendar según el clima o la cercanía a la reserva al cliente, . Responde solo con el mensaje, sin explicaciones adicionales.`;

  const response = await fetchWithRetry(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Error generating insight: ${response.statusText}`);
  }

  const data = await response.json();
  const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el insight.';

  return { insight };
};
