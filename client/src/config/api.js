const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5001' 
    : 'https://womup-backend.vercel.app';

export default API_URL;
