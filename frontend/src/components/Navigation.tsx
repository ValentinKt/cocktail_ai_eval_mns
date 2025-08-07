import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-theme/95 backdrop-blur-md shadow-xl border-b border-theme sticky top-0 z-50 magical-glow transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-4 hover:scale-105 transition-all duration-500">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 via-secondary-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-12 breathing hover-glow">
                  <span className="text-3xl text-white sparkle emoji-wiggle">🍸</span>
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              <div>
                <span className="text-3xl font-display font-bold text-shimmer">
                  Mixologue
                </span>
                <div className="text-sm text-theme-secondary font-semibold tracking-wide"><span className="emoji-bounce">✨</span> IA Cocktail Creator <span className="emoji-heartbeat">🤖</span></div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className={`group relative px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 magical-glow hover-glow ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 shadow-2xl shadow-primary-500/30' 
                  : 'text-theme hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:shadow-xl dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center space-x-3 relative z-10">
                <span className={`text-2xl transition-transform duration-300 emoji-bounce ${
                  isActive('/') ? 'sparkle' : 'group-hover:wiggle'
                }`}>✨</span>
                <span>Générateur</span>
              </span>
              {isActive('/') && (
                <div className="absolute inset-0 morphing-gradient rounded-2xl opacity-30"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-secondary-400/0 to-purple-400/0 group-hover:from-primary-400/10 group-hover:via-secondary-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-500"></div>
            </Link>
            <Link
              to="/history"
              className={`group relative px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 magical-glow hover-glow ${
                isActive('/history') 
                  ? 'text-white bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 shadow-2xl shadow-primary-500/30' 
                  : 'text-theme hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:shadow-xl dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center space-x-3 relative z-10">
                <span className={`text-2xl transition-transform duration-300 emoji-wiggle ${
                  isActive('/history') ? 'sparkle' : 'group-hover:wiggle'
                }`}>📚</span>
                <span>Historique</span>
              </span>
              {isActive('/history') && (
                <div className="absolute inset-0 morphing-gradient rounded-2xl opacity-30"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-secondary-400/0 to-purple-400/0 group-hover:from-primary-400/10 group-hover:via-secondary-400/10 group-hover:to-purple-400/10 rounded-2xl transition-all duration-500"></div>
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="group relative p-4 rounded-2xl text-lg font-bold transition-all duration-500 transform hover:scale-110 magical-glow hover-glow text-theme hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:shadow-xl dark:hover:bg-gray-700"
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              <span className="text-2xl emoji-bounce group-hover:emoji-wiggle">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;