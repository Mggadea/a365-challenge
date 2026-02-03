# Assist365 - Prueba Técnica


## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | React 19 |
| **Lenguaje** | TypeScript |
| **Bundler** | Vite 7 |
| **Estilos** | Tailwind CSS 4 |
| **Estado del servidor** | TanStack Query (React Query) |
| **HTTP Client** | Fetch API / Axios |
| **IA** | Google Gemini 2.5 Flash |
| **Testing** | Vitest + Testing Library |
| **Linting** | ESLint |

## 📁 Estructura del Proyecto

```
src/
├── API/                    # Servicios para llamadas a APIs externas
│   ├── aiService.ts        # Integración con Gemini AI
│   ├── bookingService.ts   # API de reservas
│   └── weatherService.ts   # API de clima
├── components/             # Componentes reutilizables
│   ├── reservationCard.tsx           # Tarjeta de reserva
│   ├── reservationCardWithWeather.tsx # Tarjeta con clima e insights
│   ├── reservationList.tsx           # Lista de reservas
│   ├── searchBox.tsx                 # Caja de búsqueda
│   └── WeatherIcon.tsx               # Iconos de clima
├── hooks/                  # Custom hooks
│   ├── useAIInsight.ts     # Hook para generar insights
│   ├── useBookings.ts      # Hook para obtener reservas
│   └── useWeather.ts       # Hook para obtener clima
├── screens/                # Pantallas de la aplicación
│   └── homeScreen.tsx      # Pantalla principal
├── types/                  # Definiciones de TypeScript
│   └── index.ts            # Interfaces y tipos
├── utils/                  # Utilidades
│   └── dateFormatter.ts    # Formateo de fechas
└── test/                   # Tests
    ├── integration/        # Tests de integración
    └── utils/              # Utilidades de testing
```

## 🚀 Cómo correr el proyecto

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### Prerrequisitos

* Node.js (v18 o superior)
* npm o yarn
* Una API Key de Google Gemini (para insights con IA)
* API Key del servicio de clima 

### Instalación

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/a365-challenge.git
    cd a365-challenge
    ```

2. Instalar dependencias:
    ```bash
    npm install
    ```

3. Configuración de variables de entorno:
    * Crea un archivo `.env` en la raíz del proyecto
    * Agrega las siguientes variables:
    ```env
    VITE_GEMINI_API_KEY=tu_clave_de_gemini
    VITE_WEATHER_AUTH_KEY=tu_clave_de_clima
    ```

### Ejecución

Para correr el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |
| `npm run test` | Ejecuta los tests en modo watch |
| `npm run test:run` | Ejecuta los tests una vez |
| `npm run test:coverage` | Ejecuta los tests con reporte de cobertura |

## 🧪 Testing

El proyecto incluye tests de integración para:

- **Servicios API**: Tests para `bookingService`, `weatherService` y `aiService`
- **Componentes**: Tests de renderizado e interacción
- **Hooks**: Tests de los custom hooks con React Query

Ejecutar tests:

```bash
# Modo watch
npm run test

# Ejecución única
npm run test:run

# Con cobertura
npm run test:coverage
```

## 🔌 APIs Utilizadas

### API de Reservas
- **Endpoint**: `https://3ccfrjulc8.execute-api.us-west-1.amazonaws.com/dev/reservasHandler`
- **Parámetros**: `pasajero`, `reserva`, `page`, `pageSize`
- **Respuesta**: Lista paginada de reservas

### API de Clima
- **Endpoint**: `http://api.assist-365.com/api/weather/current`
- **Autenticación**: Header `X-System-Auth-Key`
- **Parámetros**: `city`, `units`, `lang`

### API de Gemini (IA)
- **Modelo**: `gemini-2.5-flash`
- **Uso**: Generación de insights personalizados para agentes
- **Rate Limiting**: Implementación de retry con exponential backoff

## 📝 Decisiones Técnicas

1. **App React en vez de React native**: Elegi esta posibilidad para un desarrollo más rápido sin configurar emuladores ni gestionar builds nativos.


2. **Uso de Vite en vez de otra alternativa**: Elegi esta posibilidad ya que comparado a otras alternativas es un bundler rápido y de fácil configuración, Lo cual viene bien al trabajar con tiempo limitado.


3**Tailwind CSS**: Para un desarrollo rápido y consistente de la UI sin necesidad de CSS personalizado.

4. **Hooks personalizados**: Separan la lógica de negocio de los componentes, facilitando testing y reutilización.

5. **Insights bajo demanda**: Los insights de IA se generan al hacer clic en una tarjeta, evitando llamadas innecesarias. Use Gemini ya que es la que estoy más familiarizado y hoy en dia creo que es de las mejores opciones, en especial gemini-2.5-flash ya que es rápida y con bajo consumo de tokens para nuestra utilidad actual es más que suficiente.




