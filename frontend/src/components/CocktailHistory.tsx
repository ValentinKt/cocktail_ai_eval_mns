import React, { useState, useEffect } from 'react';
import type { Cocktail, CocktailFilters } from '../types';
import { cocktailApi } from '../services/api';
import CocktailCard from './CocktailCard';

const CocktailHistory: React.FC = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CocktailFilters>({
    search: '',
    filter: 'all',
    page: 1
  });

  useEffect(() => {
    fetchCocktails();
  }, [filters]);

  const fetchCocktails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cocktailApi.getCocktails({
        search: filters.search || undefined,
        filter: filters.filter !== 'all' ? filters.filter : undefined,
        page: filters.page
      });
      
      if (response.success && response.data) {
        setCocktails(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement des cocktails');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (filter: 'all' | 'favorites' | 'recent') => {
    setFilters(prev => ({ ...prev, filter, page: 1 }));
  };

  const handleFavoriteToggle = (updatedCocktail: Cocktail) => {
    setCocktails(prev => 
      prev.map(cocktail => 
        cocktail.id === updatedCocktail.id 
          ? updatedCocktail 
          : cocktail
      )
    );
  };

  const handleDelete = async (cocktailId: number) => {
    setCocktails(prevCocktails => 
      prevCocktails.filter(cocktail => cocktail.id !== cocktailId)
    );
  };

  const filteredCocktails = cocktails.filter(cocktail => {
    const matchesSearch = !filters.search || 
      cocktail.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      cocktail.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      cocktail.ingredients.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesFilter = 
      filters.filter === 'all' ||
      (filters.filter === 'favorites' && cocktail.is_favorite) ||
      (filters.filter === 'recent' && new Date(cocktail.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 dark:from-primary-800/20 dark:to-secondary-800/20 rounded-full float animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-secondary-200/20 to-purple-200/20 dark:from-secondary-800/20 dark:to-purple-800/20 rounded-full float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-pink-200/20 to-primary-200/20 dark:from-pink-800/20 dark:to-primary-800/20 rounded-full float" style={{animationDelay: '6s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-bold text-theme mb-6 text-shimmer">
            <span className="sparkle text-6xl emoji-bounce">📚</span> Historique des Cocktails <span className="emoji-glow">✨</span>
          </h1>
          <p className="text-2xl text-theme-secondary leading-relaxed">
            Retrouvez tous vos cocktails créés avec amour <span className="emoji-heartbeat">❤️</span>
          </p>
        </div>

        {/* Enhanced Search and filters */}
        <div className="mb-12 space-y-8">
          {/* Search bar */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Rechercher un cocktail magique... 🔍✨"
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-6 py-4 pl-16 text-lg border-2 border-theme rounded-2xl focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-xl magical-glow text-theme"
            />
            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:scale-110 transition-all duration-300 emoji-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Enhanced Filter buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 magical-glow border-2 hover-glow ${
                filters.filter === 'all'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-2xl border-primary-300 morphing-gradient'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className={`mr-3 text-2xl ${filters.filter === 'all' ? 'sparkle emoji-rainbow' : 'emoji-wiggle'} transition-transform duration-300`}>
                🍹
              </span>
              Tous
            </button>
            <button
              onClick={() => handleFilterChange('favorites')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 magical-glow border-2 hover-glow ${
                filters.filter === 'favorites'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-2xl border-primary-300 morphing-gradient'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className={`mr-3 text-2xl ${filters.filter === 'favorites' ? 'sparkle emoji-heartbeat' : 'emoji-bounce'} transition-transform duration-300`}>
                ❤️
              </span>
              Favoris
            </button>
            <button
              onClick={() => handleFilterChange('recent')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 magical-glow border-2 hover-glow ${
                filters.filter === 'recent'
                   ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-2xl border-primary-300 morphing-gradient'
                   : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className={`mr-3 text-2xl ${filters.filter === 'recent' ? 'sparkle emoji-glow' : 'emoji-wiggle'} transition-transform duration-300`}>
                🕒
              </span>
              Récents
            </button>
          </div>
        </div>

        {/* Enhanced Loading state */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-200 dark:border-primary-800"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-500 dark:border-primary-400 border-t-transparent absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-pulse emoji-rainbow">🍹</span>
              </div>
            </div>
            <p className="mt-6 text-xl text-theme-secondary font-medium animate-pulse">Chargement de vos cocktails magiques... <span className="emoji-bounce">✨</span></p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="glass-card magical-glow max-w-lg mx-auto p-8 border-2 border-red-200 dark:border-red-800 bg-white/80 dark:bg-gray-800/80">
              <div className="text-6xl mb-6 animate-bounce emoji-shake">😵</div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Oups ! Une erreur est survenue <span className="emoji-wiggle">⚠️</span></h3>
              <p className="text-red-500 dark:text-red-400 mb-8 text-lg">{error}</p>
              <button
                onClick={fetchCocktails}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 magical-glow border-2 border-red-300 dark:border-red-700 hover-glow"
              >
                <span className="mr-3 text-xl emoji-bounce">🔄</span>
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredCocktails.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-card magical-glow max-w-lg mx-auto p-12 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <div className="text-8xl mb-8 float emoji-wiggle">
                {filters.search ? '🔍' : '🍸'}
              </div>
              <h3 className="text-3xl font-bold text-theme mb-4 text-shimmer">
                {filters.search || filters.filter !== 'all' 
                  ? 'Aucun cocktail trouvé' 
                  : 'Aucun cocktail pour le moment'} <span className="emoji-bounce">😔</span>
              </h3>
              <p className="text-xl text-theme-secondary mb-8 leading-relaxed">
                {filters.search || filters.filter !== 'all'
                  ? 'Essayez avec d\'autres mots-clés magiques'
                  : 'Commencez par créer votre premier cocktail enchanteur !'}
              </p>
              {(!filters.search && filters.filter === 'all') && (
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 magical-glow border-2 border-primary-300 dark:border-primary-700 hover-glow"
                >
                  <span className="mr-3 text-xl sparkle emoji-rainbow">✨</span>
                  Créer mon premier cocktail <span className="emoji-bounce">🍹</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Cocktails grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {filteredCocktails.map((cocktail, index) => (
                <div 
                  key={cocktail.id}
                  className="fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <CocktailCard
                    cocktail={cocktail}
                    showActions={true}
                    onFavoriteToggle={handleFavoriteToggle}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {/* Enhanced Statistics */}
            <div className="glass-card magical-glow text-center p-8 max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover-glow">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-4xl sparkle emoji-rainbow">📊</span>
                <h3 className="text-2xl font-bold text-theme">Statistiques <span className="emoji-bounce">✨</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2 emoji-bounce">
                    {filteredCocktails.length} <span className="emoji-wiggle">🔍</span>
                  </div>
                  <div className="text-theme-secondary font-medium">
                    Cocktail{filteredCocktails.length > 1 ? 's' : ''} affiché{filteredCocktails.length > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2 emoji-glow">
                    {cocktails.length} <span className="emoji-rainbow">🍹</span>
                  </div>
                  <div className="text-theme-secondary font-medium">
                    Total créé{cocktails.length > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 dark:text-red-400 mb-2 emoji-heartbeat">
                    {cocktails.filter(c => c.is_favorite).length} <span className="emoji-bounce">❤️</span>
                  </div>
                  <div className="text-theme-secondary font-medium">
                    Favori{cocktails.filter(c => c.is_favorite).length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CocktailHistory;