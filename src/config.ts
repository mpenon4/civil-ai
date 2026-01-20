// Environment variables for API keys
// In production, use .env file instead

export const config = {
    supabase: {
        url: 'https://cxxaveycmpsiagmvnysz.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGF2ZXljbXBzaWFnbXZueXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzY5NDgsImV4cCI6MjA4NDQ1Mjk0OH0.n84-L5zoZ4Kv6qV0lCtwaO2mdn8YkljRQ8fz3naSqRc',
    },
    google: {
        apiKey: 'AIzaSyB9zAlZ6z0Qm7cdHk7ofgPpLUYtMtdj38k', // Google Cloud API Key (for Sheets, Maps)
    },
    openweather: {
        apiKey: 'DEMO_KEY', // TODO: Add OpenWeatherMap key for real weather
    },
};
