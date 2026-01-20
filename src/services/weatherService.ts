// Weather and Location Services
// Uses OpenWeatherMap API (free tier: 1000 calls/day)

const OPENWEATHER_API_KEY = 'DEMO_KEY'; // Replace with real key for production

export interface WeatherData {
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rain' | 'storm';
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
}

export interface ProjectLocation {
    city: string;
    country: string;
    lat: number;
    lng: number;
}

// Mock weather data for demo (used when no API key)
const MOCK_WEATHER: Record<string, WeatherData> = {
    'Buenos Aires': { temp: 28, condition: 'sunny', description: 'Cielo despejado', icon: '01d', humidity: 45, windSpeed: 15 },
    'Córdoba': { temp: 22, condition: 'rain', description: 'Lluvia ligera', icon: '10d', humidity: 80, windSpeed: 8 },
    'Rosario': { temp: 25, condition: 'cloudy', description: 'Parcialmente nublado', icon: '03d', humidity: 60, windSpeed: 12 },
};

export async function fetchWeather(location: ProjectLocation): Promise<WeatherData> {
    // If using demo key, return mock data
    if (OPENWEATHER_API_KEY === 'DEMO_KEY') {
        console.log('[Weather] Using mock data for:', location.city);
        return MOCK_WEATHER[location.city] || MOCK_WEATHER['Buenos Aires'];
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);
        const data = await response.json();

        const conditionMap: Record<string, WeatherData['condition']> = {
            'Clear': 'sunny',
            'Clouds': 'cloudy',
            'Rain': 'rain',
            'Drizzle': 'rain',
            'Thunderstorm': 'storm',
        };

        return {
            temp: Math.round(data.main.temp),
            condition: conditionMap[data.weather[0].main] || 'cloudy',
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        };
    } catch (error) {
        console.error('[Weather] API Error:', error);
        return MOCK_WEATHER['Buenos Aires'];
    }
}

// Google Maps Static URL (no API key needed for embed)
export function getMapUrl(location: ProjectLocation, zoom = 15): string {
    return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=${zoom}&output=embed`;
}

// Get static map image URL (requires API key for high usage)
export function getStaticMapUrl(location: ProjectLocation, width = 400, height = 200): string {
    // Using OpenStreetMap as fallback (no API key needed)
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${location.lat},${location.lng}&zoom=14&size=${width}x${height}&markers=${location.lat},${location.lng},red`;
}
