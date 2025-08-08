// Imports des dépendances React et des bibliothèques tierces
import { useState, type FC } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Gestion des formulaires
import * as Yup from 'yup'; // Validation des données
import type { Cocktail } from '../types';
import CocktailCard from '../components/CocktailCard';

// Schéma de validation pour le formulaire de génération de cocktail
const validationSchema = Yup.object({
  user_request: Yup.string()
    .min(10, 'Votre demande doit contenir au moins 10 caractères')
    .max(500, 'Votre demande ne peut pas dépasser 500 caractères')
    .required('Veuillez décrire le cocktail que vous souhaitez'),
});
/**
 * Composant principal pour la génération de cocktails personnalisés
 * Permet aux utilisateurs de décrire leur cocktail idéal et génère une recette avec IA
 */
export const CocktailGenerator: FC = () => {
  // État pour stocker le cocktail généré
  const [generatedCocktail, setGeneratedCocktail] = useState<Cocktail | null>(null);
  // État pour gérer l'affichage du loader pendant la génération
  const [isLoading, setIsLoading] = useState(false);
  // État pour gérer les messages d'erreur
  const [error, setError] = useState<string | null>(null);

  /**
   * Gère la soumission du formulaire et la génération du cocktail
   * @param values - Les valeurs du formulaire (description du cocktail souhaité)
   * @param resetForm - Fonction pour réinitialiser le formulaire
   */
  const handleSubmit = async (values: { user_request: string }) => {
    // Activation du loader et réinitialisation des erreurs
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API Django pour générer le cocktail avec fonctionnalités média
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-cocktail-with-media/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      // Vérification de la réponse
      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }
      
      // Récupération et stockage du cocktail généré
      const cocktail = await response.json();
      setGeneratedCocktail(cocktail);
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setError('Erreur lors de la génération du cocktail');
    } finally {
      // Désactivation du loader dans tous les cas
      setIsLoading(false);
    }
  };

  /**
   * Réinitialise l'état pour permettre la génération d'un nouveau cocktail
   */
  const handleNewCocktail = () => {
    setGeneratedCocktail(null);
    setError(null);
  };

  const inspirationCards = [
    {
      title: "Cocktail Tropical",
      description: "Un cocktail fruité avec des saveurs exotiques",
      prompt: "Je veux un cocktail tropical avec des fruits exotiques et une ambiance reggae"
    },
    {
      title: "Cocktail Élégant",
      description: "Un cocktail sophistiqué pour une soirée chic",
      prompt: "Créez-moi un cocktail élégant pour une soirée jazz dans un bar feutré"
    },
    {
      title: "Cocktail Rafraîchissant",
      description: "Un cocktail léger et désaltérant",
      prompt: "J'aimerais un cocktail rafraîchissant avec des herbes fraîches et une musique lounge"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!generatedCocktail ? (
        <>          <div className="text-center mb-16 slide-up relative">
            {/* Hero Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-300/20 to-secondary-300/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute top-20 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="inline-block mb-8">
              <div className="relative">
                <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-primary-400 via-secondary-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl breathing magical-glow hover-glow">
                  <span className="text-5xl sparkle emoji-wiggle">🍸</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                  <span className="text-lg emoji-bounce">✨</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse emoji-heartbeat" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-shimmer mb-8 leading-tight">
              Créez votre cocktail parfait
            </h1>
            <p className="text-2xl md:text-3xl text-theme-secondary max-w-4xl mx-auto leading-relaxed mb-6">
              Décrivez vos envies et laissez notre IA créer le cocktail de vos rêves <span className="emoji-heartbeat">🤖</span>
            </p>
            <div className="flex justify-center space-x-6 text-lg text-theme-secondary">
              <div className="flex items-center space-x-2 hover-scale">
                <span className="text-2xl emoji-rainbow">🎨</span>
                <span>Créatif</span>
              </div>
              <div className="flex items-center space-x-2 hover-scale">
                <span className="text-2xl emoji-wiggle" style={{animationDelay: '0.3s'}}>⚡</span>
                <span>Instantané</span>
              </div>
              <div className="flex items-center space-x-2 hover-scale">
                <span className="text-2xl emoji-wiggle" style={{animationDelay: '0.6s'}}>🎵</span>
                <span>Ambiance musicale</span>
              </div>
              <div className="flex items-center space-x-2 hover-scale">
                <span className="text-2xl emoji-glow" style={{animationDelay: '0.9s'}}>🌟</span>
                <span>IA créative</span>
              </div>
              <div className="flex items-center space-x-2 hover-scale">
                <span className="text-2xl emoji-bounce" style={{animationDelay: '1.2s'}}>🚀</span>
                <span>Innovation</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card mb-12 bounce-in magical-glow relative overflow-hidden hover-lift">
            {/* Card Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30 dark:from-gray-800/30 dark:to-gray-700/30 opacity-50"></div>
            
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-display font-bold text-theme mb-3">
                <span className="sparkle emoji-wiggle">🍹</span> Décrivez votre cocktail de rêve <span className="emoji-heartbeat">✨</span>
              </h2>
              <p className="text-xl text-theme-secondary leading-relaxed">
                Plus vous êtes précis, plus le résultat sera magique ! <span className="emoji-bounce">🎯</span>
              </p>
            </div>
            <Formik
              initialValues={{ user_request: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form className="space-y-6">
                  <div className="relative">
                    <label htmlFor="user_request" className="block text-lg font-semibold text-theme mb-3">
                      <span className="emoji-bounce">💭</span> Votre inspiration <span className="emoji-glow">🌟</span>
                    </label>
                    <div className="relative">
                      <Field
                        as="textarea"
                        id="user_request"
                        name="user_request"
                        rows={5}
                        className="input-field resize-none text-lg leading-relaxed shadow-lg hover:shadow-xl transition-all duration-300 focus:scale-[1.02]"
                        placeholder="Ex: Je veux un cocktail fruité avec des notes d'agrumes, parfait pour une soirée d'été avec une ambiance jazz... 🎵🍊✨"
                      />
                      <div className="absolute bottom-3 right-3 text-sm text-theme-secondary">
                        <span className={values.user_request.length > 450 ? 'text-orange-500 emoji-shake' : ''}>
                          {values.user_request.length}/500
                        </span>
                      </div>
                    </div>
                    <ErrorMessage name="user_request" component="div" className="text-red-500 text-sm mt-2 font-medium" />
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 bounce-in hover-lift">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-xl emoji-shake">⚠️</span>
                        <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`relative w-full py-6 text-2xl font-bold rounded-2xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden magical-glow hover-glow ${
                      isLoading 
                        ? 'bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 text-white shadow-2xl pulse-glow animate-pulse' 
                        : 'bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 text-white shadow-2xl hover:shadow-3xl hover:scale-105 hover:-translate-y-1'
                    }`}
                  >
                    {/* Button Background Effect */}
                    <div className="absolute inset-0 morphing-gradient opacity-30"></div>
                    
                    <div className="relative z-10">
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white"></div>
                          <span className="sparkle emoji-rainbow">🎭</span>
                          <span>Création de votre cocktail magique...</span>
                          <span className="emoji-bounce">✨</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center space-x-3">
                          <span className="sparkle text-3xl emoji-glow">✨</span>
                          <span>Générer mon cocktail parfait</span>
                          <span className="text-3xl breathing emoji-wiggle">🍸</span>
                          <span className="emoji-heartbeat">🚀</span>
                        </span>
                      )}
                    </div>
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="mb-16 fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-theme mb-4">
                <span className="sparkle emoji-bounce">💡</span> Besoin d'inspiration ? <span className="emoji-glow">✨</span>
              </h2>
              <p className="text-xl text-theme-secondary leading-relaxed">
                Cliquez sur une carte pour remplir automatiquement votre demande <span className="emoji-wiggle">👆</span>
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {inspirationCards.map((card, index) => (
                <div 
                  key={index} 
                  className="group glass-card hover-lift cursor-pointer transform transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-400 magical-glow relative overflow-hidden hover-glow"
                  onClick={() => {
                    const textarea = document.getElementById('user_request') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value = card.prompt;
                      textarea.dispatchEvent(new Event('input', { bubbles: true }));
                      textarea.focus();
                    }
                  }}
                >
                  {/* Card Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-secondary-100/30 to-purple-100/30 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 morphing-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-2xl text-theme group-hover:text-primary-600 transition-colors duration-500">
                        {card.title}
                      </h3>
                      <span className="text-3xl group-hover:scale-125 emoji-wiggle group-hover:emoji-bounce transition-transform duration-500">
                        {index === 0 ? '🏝️' : index === 1 ? '🎩' : '🌿'}
                      </span>
                    </div>
                    <p className="text-lg text-theme-secondary leading-relaxed group-hover:text-theme transition-colors duration-500 mb-6">
                      {card.description}
                    </p>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="text-lg font-bold">Cliquer pour utiliser</span>
                      <span className="ml-3 emoji-bounce group-hover:emoji-wiggle">👆</span>
                      <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" style={{animationDelay: '0.3s'}}></div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8 slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold gradient-text mb-3">
              🎉 Votre cocktail est prêt !
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
               Découvrez votre création personnalisée
             </p>
          </div>
          
          <div className="bounce-in">
            {generatedCocktail && <CocktailCard cocktail={generatedCocktail} showActions={true} />}
          </div>
          
          <div className="flex justify-center space-x-6 fade-in">
            <button
              onClick={handleNewCocktail}
              className="btn-secondary px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>🔄 Nouveau cocktail</span>
              </span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>⬆️ Retour en haut</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CocktailGenerator;