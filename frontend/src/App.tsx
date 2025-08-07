import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import CocktailGenerator from './components/CocktailGenerator';
import CocktailHistory from './components/CocktailHistory';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden bg-theme transition-theme">
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/30 via-transparent to-yellow-50/30 dark:from-purple-900/20 dark:via-transparent dark:to-blue-900/20 transition-all duration-500"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-xl animate-float" style={{animationDelay: '0.5s'}}></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <Navigation />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<CocktailGenerator />} />
            <Route path="/history" element={<CocktailHistory />} />
          </Routes>
        </main>
        
        <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-lg text-white">🍸</span>
                  </div>
                  <span className="font-display font-bold text-2xl gradient-text">Mixologue Augmenté</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                   Générateur de cocktails alimenté par l'intelligence artificielle
                 </p>
              </div>
              
              <div className="flex justify-center space-x-8 mb-6 text-sm text-theme-secondary">
                <div className="flex items-center space-x-2 hover-scale">
                  <span className="text-lg emoji-bounce">⚡</span>
                  <span>Génération instantanée</span>
                </div>
                <div className="flex items-center space-x-2 hover-scale">
                  <span className="text-lg emoji-rainbow">🎨</span>
                  <span>Recettes créatives</span>
                </div>
                <div className="flex items-center space-x-2 hover-scale">
                  <span className="text-lg emoji-wiggle">🎵</span>
                  <span>Ambiances musicales</span>
                </div>
                <div className="flex items-center space-x-2 hover-scale">
                  <span className="text-lg emoji-heartbeat">🌟</span>
                  <span>IA Avancée</span>
                </div>
              </div>
              
              <div className="border-t border-theme pt-6">
                <p className="text-sm text-theme-secondary">
                  Créé avec <span className="emoji-heartbeat">❤️</span> en utilisant React, TypeScript, Django et OpenAI <span className="emoji-bounce">🚀</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
