export const BASE_URL = import.meta.env.DEV 
    ? 'http://localhost:5001' 
    : 'https://womup-backend.vercel.app';

export const API_URL = `${BASE_URL}/api`;
