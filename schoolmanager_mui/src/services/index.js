import foundationService from './foundation';

/**
 * API Gateway / Service Hub
 * Centralizes all service access for the application.
 */
export const api = {
  foundation: foundationService,
  // Add other services here as they are created
};

export default api;
