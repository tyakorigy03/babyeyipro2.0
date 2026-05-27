
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const getUploadUrl = (path) => {
  if (!path) return null;
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${base}${path}`;
};
