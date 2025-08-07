// Configuration et services API pour l'application Mixologue
import axios from 'axios';
import type { Cocktail, CocktailRequest, CocktailResponse } from '../types';

/**
 * Interface standardisée pour les réponses API
 * Permet une gestion cohérente des succès et erreurs
 */
interface ApiResponseType<T> {
  success: boolean; // Indique si la requête a réussi
  data?: T; // Données retournées en cas de succès
  error?: string; // Message d'erreur en cas d'échec
}

// URL de base de l'API, configurable via les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Instance Axios configurée pour l'API Django
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur pour ajouter automatiquement le token CSRF Django
 * Nécessaire pour la protection contre les attaques CSRF
 */
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.getAttribute('value');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

/**
 * Service API pour les opérations liées aux cocktails
 * Centralise toutes les requêtes vers le backend Django
 */
export const cocktailApi = {
  /**
   * Génère un nouveau cocktail basé sur la demande utilisateur
   * @param request - Paramètres de génération du cocktail
   * @returns Promise<Cocktail> - Le cocktail généré
   */
  generateCocktail: async (request: CocktailRequest): Promise<Cocktail> => {
    try {
      const response = await api.post('/api/generate-cocktail/', request);
      return response.data;
    } catch (error) {
      console.error('Error generating cocktail:', error);
      throw error;
    }
  },

  // Get all cocktails with optional filters
  getCocktails: async (params?: {
    search?: string;
    filter?: string;
    page?: number;
  }): Promise<ApiResponseType<Cocktail[]>> => {
    try {
      const response = await api.get('/api/cocktails/', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching cocktails:', error);
      return {
        success: false,
        error: 'Failed to fetch cocktails',
      };
    }
  },

  // Get a single cocktail by ID
  getCocktail: async (id: number): Promise<ApiResponseType<Cocktail>> => {
    try {
      const response = await api.get(`/cocktail/${id}/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching cocktail:', error);
      return {
        success: false,
        error: 'Failed to fetch cocktail',
      };
    }
  },

  // Toggle favorite status
  toggleFavorite: async (id: number): Promise<ApiResponseType<{ is_favorite: boolean }>> => {
    try {
      const response = await api.post(`/api/cocktail/${id}/favorite/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        success: false,
        error: 'Failed to toggle favorite',
      };
    }
  },

  // Delete a cocktail
  deleteCocktail: async (id: number): Promise<ApiResponseType<void>> => {
    try {
      await api.delete(`/api/cocktail/${id}/delete/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting cocktail:', error);
      return {
        success: false,
        error: 'Failed to delete cocktail',
      };
    }
  },
};

export default api;