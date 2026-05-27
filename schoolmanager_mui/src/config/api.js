/**
 * Central API configuration.
 *
 * Set VITE_API_BASE_URL in your .env file to override:
 *   VITE_API_BASE_URL=http://localhost:5000/api
 *
 * Falls back to localhost:5000 for local development.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to build a full URL to a static uploaded file.
 * Usage: getUploadUrl('/uploads/abc123.png')  →  'http://localhost:5000/uploads/abc123.png'
 */
export const getUploadUrl = (path) => {
  if (!path) return null;
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${path}`;
};
