// API Configuration
// Change this to your PC's local IP address
// Find it by running: ipconfig in PowerShell/CMD and look for IPv4 Address

// For LAN mode (recommended for local development)
export const API_BASE_URL = __DEV__
  ? 'http://10.0.0.137:3000' // Your PC's local IP
  : 'https://your-production-api.com'; // Production URL

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

