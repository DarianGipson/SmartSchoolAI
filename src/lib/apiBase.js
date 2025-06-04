// src/lib/apiBase.js
// Set the API base URL depending on environment

let API_BASE = '';

if (import.meta.env.PROD) {
  // Use your deployed backend URL in production
  API_BASE = 'https://tranquil-crepe-967601.onrender.com';
} else {
  // Use relative path for local development
  API_BASE = '';
}

export default API_BASE;
