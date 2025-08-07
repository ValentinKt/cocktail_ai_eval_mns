// Imports des dépendances React et des types
import React, { useState } from 'react';
import type { Cocktail } from '../types';
import { cocktailApi } from '../services/api';

/**
 * Interface définissant les props du composant CocktailCard
 */
interface CocktailCardProps {
  cocktail: Cocktail; // Données du cocktail à afficher
  showActions?: boolean; // Afficher ou non les boutons d'action (favoris, suppression)
  onFavoriteToggle?: (cocktail: Cocktail) => void; // Callback appelé lors du toggle des favoris
  onDelete?: (cocktailId: number) => void; // Callback appelé lors de la suppression
}

/**
 * Composant CocktailCard - Affiche une carte de cocktail avec ses informations
 * et les actions possibles (favoris, suppression)
 */
const CocktailCard: React.FC<CocktailCardProps> = ({ 
  cocktail, 
  showActions = false, 
  onFavoriteToggle,
  onDelete 
}) => {
  // État local pour gérer le statut favori (optimistic update)
  const [isFavorite, setIsFavorite] = useState(cocktail.is_favorite || false);
  // État pour désactiver le bouton pendant la requête de toggle
  const [isToggling, setIsToggling] = useState(false);
  // État pour désactiver le bouton pendant la suppression
  const [isDeleting, setIsDeleting] = useState(false);
  // État pour afficher la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Gère le toggle du statut favori d'un cocktail
   * Utilise un optimistic update pour une meilleure UX
   */
  const handleToggleFavorite = async () => {
    // Éviter les clics multiples pendant la requête
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      console.log('Toggling favorite for cocktail:', cocktail.id);
      // Appel à l'API pour changer le statut favori
      const response = await cocktailApi.toggleFavorite(cocktail.id);
      console.log('Toggle favorite response:', response);
      
      if (response.success && response.data) {
        // Mise à jour de l'état local avec la réponse du serveur
        setIsFavorite(response.data.is_favorite);
        // Notification du composant parent si callback fourni
        if (onFavoriteToggle) {
          onFavoriteToggle({ ...cocktail, is_favorite: response.data.is_favorite });
        }
      } else {
        console.error('Failed to toggle favorite:', response.error);
        // Affichage d'un message d'erreur utilisateur
        alert('Erreur lors de la mise à jour des favoris. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Erreur de connexion. Veuillez vérifier votre connexion internet.');
    } finally {
      // Réactivation du bouton dans tous les cas
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const response = await cocktailApi.deleteCocktail(cocktail.id);
      if (response.success) {
        if (onDelete) {
          onDelete(cocktail.id);
        }
      }
    } catch (error) {
      console.error('Error deleting cocktail:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatIngredients = (ingredients: string) => {
    return ingredients.split('\n').filter(line => line.trim()).map((ingredient, index) => (
      <li key={index} className="flex items-start space-x-2">
        <span className="text-primary-500 mt-1">•</span>
        <span>{ingredient.trim()}</span>
      </li>
    ));
  };

  return (
    <div className="glass-card hover-lift transform transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-400 magical-glow relative overflow-hidden group hover-glow">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 via-secondary-100/40 to-purple-100/40 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 morphing-gradient opacity-0 group-hover:opacity-15 transition-opacity duration-700"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-3 right-3 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" style={{animationDelay: '0.3s'}}></div>
      
      {/* Floating cocktail emoji */}
      <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 emoji-wiggle">
        🍸
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-500 emoji-heartbeat"></div>
              <h3 className="text-3xl font-display font-bold gradient-text group-hover:scale-105 transition-all duration-500 text-shimmer">
                {cocktail.name}
              </h3>
              <span className="emoji-bounce">✨</span>
            </div>
            <div className="flex items-center space-x-2 text-base text-theme-secondary group-hover:text-theme transition-colors duration-300">
              <span className="text-lg group-hover:scale-110 emoji-wiggle transition-transform duration-300">📅</span>
              <span>Créé le {formatDate(cocktail.created_at)}</span>
            </div>
          </div>
          
          {showActions && (
            <button
              onClick={handleToggleFavorite}
              disabled={isToggling}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-105 hover-glow ${
                isFavorite 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-lg emoji-heartbeat' 
                  : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 border border-gray-200 dark:border-gray-600'
              } ${isToggling ? 'animate-pulse' : ''}`}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <svg className="w-7 h-7" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-8">
          <div className="group/section">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-3xl group-hover/section:scale-110 emoji-wiggle transition-transform duration-300">📝</span>
              <h4 className="text-2xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Description</h4>
              <span className="emoji-bounce">✨</span>
            </div>
            <div className="bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-700/60 rounded-xl p-6 border border-theme group-hover/section:border-primary-200 dark:group-hover/section:border-primary-400 group-hover/section:shadow-lg transition-all duration-300">
              <p className="text-theme-secondary leading-relaxed text-xl group-hover/section:text-theme transition-colors duration-300">{cocktail.description}</p>
            </div>
          </div>

          <div className="group/section">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-3xl group-hover/section:scale-110 emoji-wiggle transition-transform duration-300">🥃</span>
              <h4 className="text-2xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Ingrédients</h4>
              <span className="emoji-bounce">🌿</span>
            </div>
            <div className="bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-700/60 rounded-xl p-6 border border-theme group-hover/section:border-primary-200 dark:group-hover/section:border-primary-400 group-hover/section:shadow-lg transition-all duration-300">
              <ul className="space-y-4 text-theme-secondary">
                {formatIngredients(cocktail.ingredients)}
              </ul>
            </div>
          </div>

          {cocktail.musical_ambiance && (
            <div className="group/section">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl emoji-wiggle">🎵</span>
                <h4 className="text-xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Ambiance Musicale</h4>
                <span className="emoji-bounce">🎶</span>
              </div>
              <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800 group-hover/section:border-purple-200 dark:group-hover/section:border-purple-600 transition-all duration-300">
                <p className="text-theme-secondary leading-relaxed text-lg italic">{cocktail.musical_ambiance}</p>
              </div>
            </div>
          )}

          {cocktail.image_prompt && (
            <div className="group/section">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl emoji-rainbow">🎨</span>
                <h4 className="text-xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Inspiration Visuelle</h4>
                <span className="emoji-glow">✨</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 group-hover/section:border-blue-200 dark:group-hover/section:border-blue-600 transition-all duration-300">
                <p className="text-theme-secondary leading-relaxed text-lg italic">{cocktail.image_prompt}</p>
              </div>
            </div>
          )}

          {cocktail.music_suggestions && (
            <div className="group/section">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl emoji-bounce">🎶</span>
                <h4 className="text-xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Suggestions Musicales</h4>
                <span className="emoji-wiggle">🎵</span>
              </div>
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800 group-hover/section:border-green-200 dark:group-hover/section:border-green-600 transition-all duration-300">
                <div className="space-y-4">
                  {cocktail.music_suggestions.genres.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-theme mb-2">Genres recommandés:</h5>
                      <div className="flex flex-wrap gap-2">
                        {cocktail.music_suggestions.genres.map((genre, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium hover-scale">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cocktail.music_suggestions.sources.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-theme mb-2">Sources musicales gratuites: <span className="emoji-wiggle">🎧</span></h5>
                      <div className="space-y-2">
                        {cocktail.music_suggestions.sources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-green-200 dark:border-green-700 hover-glow">
                            <div>
                              <span className="font-medium text-theme">{source.name}</span>
                              <p className="text-sm text-theme-secondary">{source.description}</p>
                            </div>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm hover-scale"
                            >
                              Écouter <span className="emoji-bounce">🎵</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cocktail.music_suggestions.recommendations.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-theme mb-2">Recommandations: <span className="emoji-glow">⭐</span></h5>
                      <ul className="space-y-1">
                        {cocktail.music_suggestions.recommendations.map((rec, index) => (
                          <li key={index} className="text-theme-secondary text-sm flex items-start space-x-2">
                            <span className="text-green-500 dark:text-green-400 mt-1 emoji-wiggle">♪</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {cocktail.user_request && (
            <div className="group/section">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl emoji-bounce">💭</span>
                <h4 className="text-xl font-display font-bold text-theme group-hover/section:text-primary-600 transition-colors duration-300">Demande Originale</h4>
                <span className="emoji-glow">✨</span>
              </div>
              <div className="bg-gray-50/80 dark:bg-gray-800/60 rounded-xl p-5 border-2 border-dashed border-gray-200 dark:border-gray-600 group-hover/section:border-gray-300 dark:group-hover/section:border-gray-500 transition-all duration-300 hover-glow">
                <p className="text-theme-secondary leading-relaxed text-lg italic">"{cocktail.user_request}"</p>
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-8 pt-8 border-t border-theme group-hover:border-primary-200 dark:group-hover:border-primary-400 transition-colors duration-300">
            <div className="flex items-center justify-between">
              {/* Bouton Favori */}
              <button
                onClick={handleToggleFavorite}
                disabled={isToggling}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 magical-glow hover-glow ${
                  isFavorite
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-600 dark:text-red-400 hover:from-red-200 hover:to-pink-200 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 border-2 border-red-200 dark:border-red-700'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-400 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500'
                } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-500 hover:scale-125 hover:wiggle ${
                    isFavorite ? 'text-red-500 scale-110' : 'text-gray-600 dark:text-gray-400'
                  } ${isToggling ? 'animate-pulse' : ''}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-lg">{isFavorite ? 'Favori' : 'Ajouter aux favoris'}</span>
                {isFavorite && <span className="emoji-heartbeat">❤️</span>}
              </button>

              {/* Bouton Supprimer */}
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 magical-glow hover-glow bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/40 dark:hover:to-red-700/40 border-2 border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-500 hover:scale-125 hover:wiggle ${
                    isDeleting ? 'animate-spin' : 'hover:rotate-12'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-lg">{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
                {!isDeleting && <span className="emoji-shake">🗑️</span>}
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400 emoji-shake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-theme mb-2">
                  Supprimer le cocktail ? <span className="emoji-bounce">🗑️</span>
                </h3>
                <p className="text-theme-secondary mb-6">
                  Êtes-vous sûr de vouloir supprimer <strong>"{cocktail.name}"</strong> ? Cette action est irréversible.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 hover-scale border border-gray-300 dark:border-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 hover-scale ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeleting ? 'Suppression...' : 'Supprimer'} {!isDeleting && <span className="emoji-wiggle">🗑️</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CocktailCard;